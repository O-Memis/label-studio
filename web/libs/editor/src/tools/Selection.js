import { observer } from "mobx-react";
import { types } from "mobx-state-tree";

import { IconMoveTool } from "@humansignal/icons";
import { Tool } from "../components/Toolbar/Tool";
import { AnnotationMixin } from "../mixins/AnnotationMixin";
import ToolMixin from "../mixins/Tool";
import { FF_LSDV_4930, isFF } from "../utils/feature-flags";
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
      ariaLabel="move-tool"
      active={item.selected}
      icon={<IconMoveTool />}
      label="Move"
      shortcut={item.shortcut}
      extraShortcuts={item.extraShortcuts}
      onClick={() => {
        item.manager.selectTool(item, !item.selected);
      }}
    />
  );
});

const _Tool = types
  .model("SelectionTool", {
    shortcut: "tool:move",
    group: "control",
  })
  .views((self) => {
    return {
      get viewClass() {
        return () => <ToolView item={self} />;
      },
      get useTransformer() {
        return true;
      },
    };
  })
  .actions((self) => {
    let isSelecting = false;

    const STEP_PX = 1;

    const keydownEv = (e) => {
      if (!self.selected) return;
      if (isTextEditingTarget(e.target)) return;
      if (self.annotation?.isDrawing) return;

      if (!e.key || !e.key.startsWith("Arrow")) return;

      const region = getSingleSelectedRegion(self.annotation);
      if (!region?.setPosition) return;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case "ArrowLeft":
          dx = -STEP_PX;
          break;
        case "ArrowRight":
          dx = STEP_PX;
          break;
        case "ArrowUp":
          dy = -STEP_PX;
          break;
        case "ArrowDown":
          dy = STEP_PX;
          break;
      }

      if (dx === 0 && dy === 0) return;

      e.preventDefault();
      e.stopPropagation();

      region.setPosition(
        (region.canvasX ?? 0) + dx,
        (region.canvasY ?? 0) + dy,
        region.canvasWidth ?? 0,
        region.canvasHeight ?? 0,
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

      /**
       * Indicates that move tool always interacts with regions
       */
      shouldSkipInteractions() {
        return false;
      },

      notifyRegions(type, x, y) {
        for (const reg of self.obj.regs) {
          reg?.onSelection?.(type, x, y);
        }
      },

      mousedownEv(ev, [x, y]) {
        isSelecting = true;
        self.obj.setSelectionStart({ x, y });
        self.notifyRegions("start", x, y);
      },

      mousemoveEv(ev, [x, y]) {
        if (!isSelecting) return;
        self.obj.setSelectionEnd({ x, y });
        self.notifyRegions("move", x, y);
      },

      mouseupEv(ev, [x, y]) {
        if (!isSelecting) return;
        self.obj.setSelectionEnd({ x, y });
        const { regionsInSelectionArea } = self.obj;

        self.notifyRegions("end", x, y);
        self.obj.resetSelection();
        if (ev.ctrlKey || ev.metaKey) {
          self.annotation.extendSelectionWith(regionsInSelectionArea);
        } else {
          self.annotation.selectAreas(regionsInSelectionArea);
        }
        isSelecting = false;
      },
      clickEv(ev) {
        if (isFF(FF_LSDV_4930)) {
          isSelecting = false;
          self.obj.resetSelection();
          if (!ev.ctrlKey && !ev.metaKey) {
            self.annotation.unselectAreas();
            self.notifyRegions("reset");
          }
        }
      },
    };
  });

const Selection = types.compose("MoveTool", ToolMixin, BaseTool, AnnotationMixin, _Tool);

export { Selection };
