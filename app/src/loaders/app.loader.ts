import { LoaderFunctionArgs } from "react-router";
import appRepository from "../repositories/app.repository";

export const appLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id) return;

  const app = await appRepository.findOne(id);

  return app;
};
