
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "admin_users": {
                  Row: {
                    "created_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"brands": {
                  Row: {
                    "id": string,"is_visible": boolean,"logo_url": string | null,"name": string,"sort_order": number
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"is_visible"?: boolean,"logo_url"?: string | null,"name": string,"sort_order"?: number
                  }
                  Update: {
                    "id"?: string,"is_visible"?: boolean,"logo_url"?: string | null,"name"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    
                  ]
                },"enquiries": {
                  Row: {
                    "brand": string | null,"created_at": string,"email": string,"id": string,"message": string,"name": string,"status": string
                  }
                  ComputedFields: never
                  Insert: {
                    "brand"?: string | null,"created_at"?: string,"email": string,"id"?: string,"message": string,"name": string,"status"?: string
                  }
                  Update: {
                    "brand"?: string | null,"created_at"?: string,"email"?: string,"id"?: string,"message"?: string,"name"?: string,"status"?: string
                  }
                  Relationships: [
                    
                  ]
                },"portfolio_categories": {
                  Row: {
                    "cover_url": string | null,"id": string,"is_visible": boolean,"slug": string,"sort_order": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "cover_url"?: string | null,"id"?: string,"is_visible"?: boolean,"slug": string,"sort_order"?: number,"title": string
                  }
                  Update: {
                    "cover_url"?: string | null,"id"?: string,"is_visible"?: boolean,"slug"?: string,"sort_order"?: number,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"portfolio_items": {
                  Row: {
                    "alt_text": string,"brand_id": string | null,"caption": string | null,"category_id": string,"created_at": string,"id": string,"image_url": string,"is_featured": boolean,"is_visible": boolean,"sort_order": number,"year": number | null
                  }
                  ComputedFields: never
                  Insert: {
                    "alt_text"?: string,"brand_id"?: string | null,"caption"?: string | null,"category_id": string,"created_at"?: string,"id"?: string,"image_url": string,"is_featured"?: boolean,"is_visible"?: boolean,"sort_order"?: number,"year"?: number | null
                  }
                  Update: {
                    "alt_text"?: string,"brand_id"?: string | null,"caption"?: string | null,"category_id"?: string,"created_at"?: string,"id"?: string,"image_url"?: string,"is_featured"?: boolean,"is_visible"?: boolean,"sort_order"?: number,"year"?: number | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "portfolio_items_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "brands"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "portfolio_items_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "portfolio_categories"
      referencedColumns: ["id"]
    }
                  ]
                },"profile": {
                  Row: {
                    "about_image_url": string | null,"beyond_frame": string | null,"bio": string | null,"city": string | null,"display_name": string,"email": string | null,"hero_eyebrow": string | null,"hero_image_url": string | null,"hero_intro": string | null,"id": number,"instagram_url": string | null,"linkedin_url": string | null,"media_kit_url": string | null,"philosophy_headline": string | null,"philosophy_image_url": string | null,"philosophy_quote": string | null,"philosophy_sub": string | null,"showreel_url": string | null,"story_video_url": string | null,"tagline": string | null,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "about_image_url"?: string | null,"beyond_frame"?: string | null,"bio"?: string | null,"city"?: string | null,"display_name": string,"email"?: string | null,"hero_eyebrow"?: string | null,"hero_image_url"?: string | null,"hero_intro"?: string | null,"id"?: number,"instagram_url"?: string | null,"linkedin_url"?: string | null,"media_kit_url"?: string | null,"philosophy_headline"?: string | null,"philosophy_image_url"?: string | null,"philosophy_quote"?: string | null,"philosophy_sub"?: string | null,"showreel_url"?: string | null,"story_video_url"?: string | null,"tagline"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "about_image_url"?: string | null,"beyond_frame"?: string | null,"bio"?: string | null,"city"?: string | null,"display_name"?: string,"email"?: string | null,"hero_eyebrow"?: string | null,"hero_image_url"?: string | null,"hero_intro"?: string | null,"id"?: number,"instagram_url"?: string | null,"linkedin_url"?: string | null,"media_kit_url"?: string | null,"philosophy_headline"?: string | null,"philosophy_image_url"?: string | null,"philosophy_quote"?: string | null,"philosophy_sub"?: string | null,"showreel_url"?: string | null,"story_video_url"?: string | null,"tagline"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"services": {
                  Row: {
                    "description": string,"id": string,"is_visible": boolean,"sort_order": number,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "description": string,"id"?: string,"is_visible"?: boolean,"sort_order"?: number,"title": string
                  }
                  Update: {
                    "description"?: string,"id"?: string,"is_visible"?: boolean,"sort_order"?: number,"title"?: string
                  }
                  Relationships: [
                    
                  ]
                },"stats": {
                  Row: {
                    "id": string,"is_visible": boolean,"label": string,"sort_order": number,"value": string
                  }
                  ComputedFields: never
                  Insert: {
                    "id"?: string,"is_visible"?: boolean,"label": string,"sort_order"?: number,"value": string
                  }
                  Update: {
                    "id"?: string,"is_visible"?: boolean,"label"?: string,"sort_order"?: number,"value"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const
