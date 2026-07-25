/**
 * Tipos de la base de datos de Supabase.
 *
 * Definidos manualmente (podrían generarse con `supabase gen types`).
 * Reflejan el esquema de `supabase/migrations`.
 */

export interface TransaccionRow {
  id: string;
  user_id: string;
  descripcion: string;
  valor: number;
  tipo: "ingreso" | "gasto";
  categoria: string;
  fecha: string; // formato ISO YYYY-MM-DD
  created_at: string;
}

export type TransaccionInsert = Omit<
  TransaccionRow,
  "id" | "user_id" | "created_at"
> & {
  id?: string;
  user_id?: string;
  created_at?: string;
};

export type TransaccionUpdate = Partial<TransaccionInsert>;

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: TransaccionRow;
        Insert: TransaccionInsert;
        Update: TransaccionUpdate;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
