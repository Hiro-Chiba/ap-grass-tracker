import { act, renderHook, waitFor } from "@testing-library/react";
import { sampleCycles } from "../sampleCycles";
import { useCycleStore } from "../useCycleStore";

const mockFetch = global.fetch as jest.Mock;
const mockResponse = (data: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data
});

describe("useCycleStore", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("初回ロードで API の周回データを状態に反映する", async () => {
    mockFetch.mockResolvedValueOnce(mockResponse(sampleCycles));

    const { result } = renderHook(() => useCycleStore());

    await waitFor(() => expect(result.current.cycles).toEqual(sampleCycles));
    expect(mockFetch).toHaveBeenCalledWith("/api/cycles");
  });

  test("連続追加時も最新の state を保ったまま周回を積み上げる", async () => {
    const apiCycles = sampleCycles;
    const createdCycle = {
      id: 99,
      subjectId: 1,
      accuracy: 80,
      date: new Date().toISOString()
    };
    const secondCycle = {
      ...createdCycle,
      id: 100,
      subjectId: createdCycle.subjectId + 1,
      accuracy: createdCycle.accuracy + 5
    };

    mockFetch
      .mockResolvedValueOnce(mockResponse(apiCycles))
      .mockResolvedValueOnce(mockResponse(createdCycle, 201))
      .mockResolvedValue(mockResponse(secondCycle, 201));

    const { result } = renderHook(() => useCycleStore());

    await waitFor(() => expect(result.current.cycles).toHaveLength(apiCycles.length));

    await act(async () => {
      await result.current.addCycle(createdCycle.subjectId, createdCycle.accuracy);
      await result.current.addCycle(secondCycle.subjectId, secondCycle.accuracy);
    });

    await waitFor(() => expect(result.current.cycles).toHaveLength(apiCycles.length + 2));
    expect(result.current.cycles[0]).toEqual(secondCycle);
    expect(result.current.cycles[1]).toEqual(createdCycle);

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/cycles",
      expect.objectContaining({ method: "POST" })
    );
  });
});
