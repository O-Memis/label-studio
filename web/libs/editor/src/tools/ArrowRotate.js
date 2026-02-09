import { observer } from "mobx-react";
import { types } from "mobx-state-tree";

import { IconRotateRightTool } from "@humansignal/icons";
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
      ariaLabel="rotate-box-tool"
      active={item.selected}
      icon={<IconRotateRightTool />}
      label="Rotate"
      onClick={() => {
        item.manager.selectTool(item, !item.selected);
      }}
    />
  );
});

const _Tool = types
  .model("ArrowRotateTool", {
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
    const STEP_DEG = 1;

    const keydownEv = (e) => {
      if (!self.selected) return;
      if (isTextEditingTarget(e.target)) return;
      if (self.annotation?.isDrawing) return;

      if (!e.key || !e.key.startsWith("Arrow")) return;

      const region = getSingleSelectedRegion(self.annotation);
      if (!region?.setPosition) return;

      let dA = 0;
      if (e.key === "ArrowLeft") dA = -STEP_DEG;
      if (e.key === "ArrowRight") dA = STEP_DEG;

      // Up/Down are intentionally no-op in rotate mode
      e.preventDefault();
      e.stopPropagation();

      if (dA === 0) return;

      region.setPosition(
        region.canvasX ?? 0,
        region.canvasY ?? 0,
        region.canvasWidth ?? 0,
        region.canvasHeight ?? 0,
        (region.rotation ?? 0) + dA,
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

const ArrowRotate = types.compose("ArrowRotateTool", ToolMixin, BaseTool, AnnotationMixin, _Tool);

export { ArrowRotate };
