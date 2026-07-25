/**
 * Tipos de la base de datos de Supabase.
 *
 * Definidos manualmente (podrían generarse con `supabase gen types`).
 * Reflejan el esquema de `supabase/migrations`.
 */

export type TransaccionRow = {
  id: string;
  user_id: string;
  descripcion: string;
  valor: number;
  tipo: "ingreso" | "gasto";
  categoria: string;
  fecha: string; // formato ISO YYYY-MM-DD
  created_at: string;
};

export type TransaccionInsert = Omit<
  TransaccionRow,
  "id" | "user_id" | "created_at"
> & {
  id?: string;
  user_id?: string;
  created_at?: string;
};

export type TransaccionUpdate = Partial<TransaccionInsert>;

export type CategoriaRow = {
  id: string;
  user_id: string;
  nombre: string;
  tipo: "ingreso" | "gasto" | "ambos";
  color: string;
  created_at: string;
};

export type CategoriaInsert = Omit<
  CategoriaRow,
  "id" | "user_id" | "created_at"
> & {
  id?: string;
  user_id?: string;
  created_at?: string;
};

export type CategoriaUpdate = Partial<CategoriaInsert>;

export type MetaRow = {
  id: string;
  user_id: string;
  nombre: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_limite: string | null;
  created_at: string;
};

export type MetaInsert = Omit<
  MetaRow,
  "id" | "user_id" | "created_at" | "monto_actual" | "fecha_limite"
> & {
  id?: string;
  user_id?: string;
  monto_actual?: number;
  fecha_limite?: string | null;
  created_at?: string;
};

export type MetaUpdate = Partial<MetaInsert>;

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: TransaccionRow;
        Insert: TransaccionInsert;
        Update: TransaccionUpdate;
        Relationships: [];
      };
      categories: {
        Row: CategoriaRow;
        Insert: CategoriaInsert;
        Update: CategoriaUpdate;
        Relationships: [];
      };
      goals: {
        Row: MetaRow;
        Insert: MetaInsert;
        Update: MetaUpdate;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
