import type { ComponentType, ReactNode } from "react";

import Aside from "./Aside";
import Analytics from "./Analytics";
import BranchFlow from "./BranchFlow";
import Card from "./Card";
import CardGrid from "./CardGrid";
import Code from "./Code";
import CodePlayground from "./CodePlayground";
import ContentImage from "./ContentImage";
import FlowDiagram from "./FlowDiagram";
import Icon from "./Icon";
import Image from "./Image";
import LessonCompletion from "./LessonCompletion";
import LinkCard from "./LinkCard";
import ParallelFlow from "./ParallelFlow";
import Quiz from "./Quiz";
import Steps from "./Steps";
import TabItem from "./TabItem";
import Tabs from "./Tabs";

/* eslint-disable @typescript-eslint/no-explicit-any -- MDX components are heterogeneous by design */
export type MDXComponents = Record<string, ComponentType<any> | ((props: any) => ReactNode) | null>;

export const mdxComponents: MDXComponents = {
  Aside,
  Analytics,
  BranchFlow,
  BranchFlowDiagram: BranchFlow,
  Card,
  CardGrid,
  Code,
  CodePlayground,
  ContentImage,
  ContentImageVariant: ContentImage,
  FlowDiagram,
  FlowChart: FlowDiagram,
  Flow: FlowDiagram,
  Icon,
  Image,
  LessonCompletion,
  LinkCard,
  ParallelFlow,
  ParallelFlowDiagram: ParallelFlow,
  Quiz,
  Steps,
  TabItem,
  Tabs,
};

export default mdxComponents;
