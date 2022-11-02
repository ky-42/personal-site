import React from "react";

const Home = React.lazy(() => import("./Home"))
const About = React.lazy(() => import("./About"))
const Connect = React.lazy(() => import("./Connect"))
const ContentView = React.lazy(() => import("./ContentView"))
const BlogList = React.lazy(() => import("./BlogList"))
const ManageContent = React.lazy(() => import("./ManageContent"))
const ProjectList = React.lazy(() => import("./ProjectList"))
const NotFound = React.lazy(() => import("./NotFound"))

export { 
  Home,
  About,
  Connect,
  ContentView,
  BlogList,
  ManageContent,
  ProjectList,
  NotFound
};