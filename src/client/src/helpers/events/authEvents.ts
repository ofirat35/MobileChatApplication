import mitt from "mitt";

type AppEvents = {
  unauthorized: void;
};

export const authEvents = mitt<AppEvents>();
