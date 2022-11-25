import { Project } from "./cache.ts";

export function mapProjectToItem(project: Project) {
  return {
    title: project.title,
    subtitle: project.path,
    icon: "projects",
    arg: `###project###${project.path}`,
    autocomplete: false,
  };
}
