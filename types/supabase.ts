export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          avatar: string | null;
        };
        Insert: {
          id: string;
          avatar?: string | null;
        };
        Update: {
          id?: string;
          avatar?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
