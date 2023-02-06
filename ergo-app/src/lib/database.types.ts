export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rowers: {
        Row: {
          country: string | null
          created_at: string | null
          id: number
          name: string
          team_id: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: number
          name: string
          team_id?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: number
          name?: string
          team_id?: number | null
          updated_at?: string | null
          url?: string
        }
      }
      trainings: {
        Row: {
          calories: number | null
          created_at: string | null
          description: string | null
          drag_factor: number | null
          duration: string | null
          heart_rate: number | null
          id: number
          is_bike: boolean | null
          meters: number | null
          name: string | null
          pace: string | null
          rest_duration: string | null
          rower_id: number
          stroke_count: number | null
          stroke_rate: number | null
        }
        Insert: {
          calories?: number | null
          created_at?: string | null
          description?: string | null
          drag_factor?: number | null
          duration?: string | null
          heart_rate?: number | null
          id?: number
          is_bike?: boolean | null
          meters?: number | null
          name?: string | null
          pace?: string | null
          rest_duration?: string | null
          rower_id: number
          stroke_count?: number | null
          stroke_rate?: number | null
        }
        Update: {
          calories?: number | null
          created_at?: string | null
          description?: string | null
          drag_factor?: number | null
          duration?: string | null
          heart_rate?: number | null
          id?: number
          is_bike?: boolean | null
          meters?: number | null
          name?: string | null
          pace?: string | null
          rest_duration?: string | null
          rower_id?: number
          stroke_count?: number | null
          stroke_rate?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
