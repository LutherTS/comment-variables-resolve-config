import { MODULE_TO_LOAD } from "../constants/bases.js";

try {
  const module = await import(process.env[MODULE_TO_LOAD]);
  process.send({ module: { default: module.default } });
} catch (error) {
  process.send({ module: null });
}
