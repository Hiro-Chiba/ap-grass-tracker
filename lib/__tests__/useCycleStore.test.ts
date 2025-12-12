import { act, renderHook, waitFor } from "@testing-library/react";
import { useCycleStore } from "../useCycleStore";
import { sampleCycles } from "../sampleCycles";

const STORAGE_KEY = "ap-grass-cycles";

describe("useCycleStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("不正なローカルストレージの値からサンプルデータで復旧する", async () => {
    window.localStorage.setItem(STORAGE_KEY, "{invalid json}");

    const { result } = renderHook(() => useCycleStore());

    await waitFor(() => expect(result.current.cycles).toHaveLength(sampleCycles.length));
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBe("{invalid json}");
  });

  test("連続追加時も最新の state を保ったまま周回を積み上げる", async () => {
    const { result } = renderHook(() => useCycleStore());

    await waitFor(() => expect(result.current.cycles).toHaveLength(sampleCycles.length));

    act(() => {
      result.current.addCycle(1, 80);
      result.current.addCycle(2, 90);
    });

    await waitFor(() => expect(result.current.cycles).toHaveLength(sampleCycles.length + 2));
    expect(result.current.cycles[0].subjectId).toBe(2);
    expect(result.current.cycles[1].subjectId).toBe(1);
  });
});
