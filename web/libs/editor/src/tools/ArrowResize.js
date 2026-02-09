import { observer } from "mobx-react";
import { types } from "mobx-state-tree";

import { IconExpandTool } from "@humansignal/icons";
import { Tool } from "../components/Toolbar/Tool";
import { AnnotationMixin } from "../mixins/AnnotationMixin";
import ToolMixin from "../mixins/Tool";
import BaseTool from "./Base";

const isTextEditingTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || target.isContentEditable;
};

const getSingleSelectedRegion = (annotation) => {
  const selectedRegions = annotation?.selectedRegions ?? [];
  if (selectedRegions.length !== 1) return null;
  return selectedRegions[0];
};

const ToolView = observer(({ item }) => {
  return (
    <Tool
      ariaLabel="resize-tool"
      active={item.selected}
      icon={<IconExpandTool />}
      label="Resize"
      onClick={() => {
        item.manager.selectTool(item, !item.selected);
      }}
    />
  );
});

const _Tool = types
  .model("ArrowResizeTool", {
    group: "control",
  })
  .views((self) => ({
    get viewClass() {
      return () => <ToolView item={self} />;
    },
    get useTransformer() {
      return true;
    },
  }))
  .actions((self) => {
    const STEP_PX = 1;

    const keydownEv = (e) => {
      if (!self.selected) return;
      if (isTextEditingTarget(e.target)) return;
      if (self.annotation?.isDrawing) return;

      if (!e.key || !e.key.startsWith("Arrow")) return;

      const region = getSingleSelectedRegion(self.annotation);
      if (!region?.setPosition) return;

      let dW = 0;
      let dH = 0;

      switch (e.key) {
        case "ArrowLeft":
          dW = -STEP_PX;
          break;
        case "ArrowRight":
          dW = STEP_PX;
          break;
        case "ArrowUp":
          dH = STEP_PX;
          break;
        case "ArrowDown":
          dH = -STEP_PX;
          break;
      }

      if (dW === 0 && dH === 0) return;

      e.preventDefault();
      e.stopPropagation();

      const nextW = Math.max(1, (region.canvasWidth ?? 0) + dW);
      const nextH = Math.max(1, (region.canvasHeight ?? 0) + dH);

      region.setPosition(
        region.canvasX ?? 0,
        region.canvasY ?? 0,
        nextW,
        nextH,
        region.rotation ?? 0,
      );
      region.notifyDrawingFinished?.();
    };

    return {
      afterUpdateSelected() {
        if (self.selected) {
          window.addEventListener("keydown", keydownEv, true);
        } else {
          window.removeEventListener("keydown", keydownEv, true);
        }
      },
      shouldSkipInteractions() {
        return false;
      },
    };
  });

const ArrowResize = types.compose("ArrowResizeTool", ToolMixin, BaseTool, AnnotationMixin, _Tool);

export { ArrowResize };
