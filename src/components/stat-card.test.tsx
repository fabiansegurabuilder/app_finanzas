import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";

describe("StatCard", () => {
  it("muestra el título, el valor y el detalle", () => {
    render(
      <StatCard
        titulo="Ingresos"
        valor="$ 1.500.000"
        icono={TrendingUp}
        tono="ingreso"
        detalle="julio de 2026"
      />,
    );

    expect(screen.getByText("Ingresos")).toBeInTheDocument();
    expect(screen.getByText("$ 1.500.000")).toBeInTheDocument();
    expect(screen.getByText("julio de 2026")).toBeInTheDocument();
  });
});
