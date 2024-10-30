import { describe, it, expect } from "vitest";
import { renderWithPlugins } from "@/utils/test-utils";
import SkeletonLoader from "./SkeletonLoader.vue";

describe("SkeletonLoader", () => {
  it("renders skeleton items when loading", () => {
    const { container } = renderWithPlugins(SkeletonLoader, {
      props: {
        loading: true,
        count: 3,
      },
    });

    const skeletonItems = container.querySelectorAll(".skeleton-item");
    expect(skeletonItems.length).toBe(3);
  });

  it("renders slot content when not loading", () => {
    const { container } = renderWithPlugins(SkeletonLoader, {
      props: {
        loading: false,
      },
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    });

    expect(container.querySelector(".skeleton-item")).toBeNull();
    expect(container.querySelector(".test-content")).toBeTruthy();
  });

  it("applies custom height to skeleton items", () => {
    const { container } = renderWithPlugins(SkeletonLoader, {
      props: {
        loading: true,
        height: 50,
      },
    });

    const skeletonItem = container.querySelector(".skeleton-item");
    expect(skeletonItem?.style.height).toBe("50px");
  });
});
