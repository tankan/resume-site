import { describe, it, expect, vi } from "vitest";
import { renderWithPlugins } from "@/utils/test-utils";
import ErrorBoundary from "./ErrorBoundary.vue";
import { nextTick } from "vue";

describe("ErrorBoundary", () => {
  it("renders slot content when no error", () => {
    const { container } = renderWithPlugins(ErrorBoundary, {
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    });

    expect(container.querySelector(".test-content")).toBeTruthy();
    expect(container.querySelector(".error-boundary")).toBeFalsy();
  });

  it("renders error message when error occurs", async () => {
    const _error = new Error("Test error");
    const { container, getByText } = renderWithPlugins(ErrorBoundary, {
      slots: {
        default: {
          template: `<div @mounted="throw new Error('Test error')">Content</div>`,
        },
      },
    });

    await nextTick();

    expect(container.querySelector(".error-boundary")).toBeTruthy();
    expect(getByText("Test error")).toBeTruthy();
  });

  it("calls onRetry prop when retry button clicked", async () => {
    const onRetry = vi.fn();
    const { getByText } = renderWithPlugins(ErrorBoundary, {
      props: {
        onRetry,
      },
    });

    // 模拟错误
    const _error = new Error("Test error");
    await nextTick();

    // 点击重试按钮
    const retryButton = getByText("重试");
    await retryButton.click();

    expect(onRetry).toHaveBeenCalled();
  });
});
