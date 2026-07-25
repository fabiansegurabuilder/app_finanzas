import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Limpia el DOM después de cada prueba para evitar fugas entre casos.
afterEach(() => {
  cleanup();
});
