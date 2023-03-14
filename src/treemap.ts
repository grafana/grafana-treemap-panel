import * as d3 from 'd3';
import { FrameView, TilingOption } from './types';

interface TreemapNode {
  // Required by D3.js
  name: string;
  value?: number;
  children?: TreemapNode[];

  // Metadata used for displaying additional information.
  frame?: FrameView;
}

// buildLayout takes the root node of a hierarchy and builds a treemap from it.
export const buildLayout = (
  root: TreemapNode,
  width: number,
  height: number,
  tiling: TilingOption
): d3.HierarchyRectangularNode<TreemapNode> => {
  const layout = d3
    .treemap<TreemapNode>()
    .tile(d3[tiling])
    .size([width, height])
    .round(true)
    .paddingInner(4)
    .paddingOuter(4)
    .paddingTop(27);

  const hierarchy = d3
    .hierarchy(root)
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  return layout(hierarchy);
};

// buildHierarchy creates a tree structure from data frames.
export const buildHierarchy = (frames: FrameView[]): TreemapNode => {
  const dataset: TreemapNode = { name: 'All' };

  frames.forEach((frame) => {
    Array.from({ length: frame.text!.values.length })
      .map((_, i) => ({
        label: frame.text!.values.get(i),
        value: frame.size!.values.get(i),
        group: frame.groupBy?.values.get(i),
        separator: frame.text!.config.custom.separator,
      }))
      .forEach(({ label, value, group, separator }, index) => {
        const path = label.endsWith(separator) ? label.slice(0, label.length - separator.length) : label;

        const prefix = [frame.name ?? ''];

        if (group) {
          prefix.push(group);
        }

        const pathElements = [...prefix, ...path.split(separator)];

        insertPath(dataset, pathElements[0] === dataset.name ? pathElements.slice(1) : pathElements, value, {
          ...frame,
          valueRowIndex: index,
        });
      });
  });

  if (dataset.children?.length === 1) {
    return { name: 'All', children: dataset.children[0].children };
  }

  return dataset;
};

// insertPath recursively creates tree nodes from a path of labels.
const insertPath = (node: TreemapNode, labelElements: string[], leafValue: number, frame: FrameView) => {
  if (!node.children) {
    node.children = [];
  }

  if (labelElements.length === 0) {
    return;
  }

  const child = node.children!.find((child) => child.name === labelElements[0]);

  if (!child) {
    const newChild: TreemapNode = { name: labelElements[0] };

    // If there's only one elements left, we consider it a leaf node.
    if (labelElements.length === 1) {
      newChild.value = leafValue;
      newChild.frame = frame;
    }

    node.children.push(newChild);

    insertPath(newChild, labelElements.slice(1), leafValue, frame);
  } else {
    insertPath(child, labelElements.slice(1), leafValue, frame);
  }
};
