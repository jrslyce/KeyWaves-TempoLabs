export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          audience_size: number
          campaign_id: string | null
          channel_name: string
          created_at: string | null
          creator_id: string | null
          id: string
          platform_links: string[]
          proposal: string
          status: string
        }
        Insert: {
          audience_size: number
          campaign_id?: string | null
          channel_name: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          platform_links?: string[]
          proposal: string
          status?: string
        }
        Update: {
          audience_size?: number
          campaign_id?: string | null
          channel_name?: string
          created_at?: string | null
          creator_id?: string | null
          id?: string
          platform_links?: string[]
          proposal?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_managers: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_managers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_meta_tags: {
        Row: {
          campaign_id: string
          tag_id: string
        }
        Insert: {
          campaign_id: string
          tag_id: string
        }
        Update: {
          campaign_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_meta_tags_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_meta_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "meta_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          accepted_platforms: string[]
          content_requirements: string[]
          created_at: string | null
          description: string
          discord_url: string | null
          eligibility_criteria: Json | null
          end_date: string
          hero_image: string
          id: string
          keys_available: number
          media_gallery: Json[] | null
          min_followers: number
          publisher_id: string | null
          start_date: string
          status: string
          title: string
        }
        Insert: {
          accepted_platforms?: string[]
          content_requirements?: string[]
          created_at?: string | null
          description: string
          discord_url?: string | null
          eligibility_criteria?: Json | null
          end_date: string
          hero_image: string
          id?: string
          keys_available?: number
          media_gallery?: Json[] | null
          min_followers?: number
          publisher_id?: string | null
          start_date: string
          status?: string
          title: string
        }
        Update: {
          accepted_platforms?: string[]
          content_requirements?: string[]
          created_at?: string | null
          description?: string
          discord_url?: string | null
          eligibility_criteria?: Json | null
          end_date?: string
          hero_image?: string
          id?: string
          keys_available?: number
          media_gallery?: Json[] | null
          min_followers?: number
          publisher_id?: string | null
          start_date?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          error_code: string | null
          error_message: string
          error_stack: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          error_code?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          error_code?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          campaign_id: string | null
          content: string
          created_at: string | null
          from_user_id: string | null
          id: string
          parent_message_id: string | null
          read_by_ids: string[] | null
          subject: string
        }
        Insert: {
          campaign_id?: string | null
          content: string
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          parent_message_id?: string | null
          read_by_ids?: string[] | null
          subject: string
        }
        Update: {
          campaign_id?: string | null
          content?: string
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          parent_message_id?: string | null
          read_by_ids?: string[] | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      meta_tags: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      publisher_members: {
        Row: {
          created_at: string | null
          id: string
          publisher_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          publisher_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          publisher_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publisher_members_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publisher_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      publishers: {
        Row: {
          created_at: string | null
          discord_url: string | null
          email: string
          id: string
          location: string | null
          logo: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          discord_url?: string | null
          email: string
          id?: string
          location?: string | null
          logo?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          discord_url?: string | null
          email?: string
          id?: string
          location?: string | null
          logo?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      user_meta_tags: {
        Row: {
          tag_id: string
          user_id: string
        }
        Insert: {
          tag_id: string
          user_id: string
        }
        Update: {
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_meta_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "meta_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_meta_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          content_style: string | null
          created_at: string | null
          email: string
          full_name: string | null
          highlight_videos: string[] | null
          id: string
          role: string
          social_media_stats: Json | null
        }
        Insert: {
          avatar_url?: string | null
          content_style?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          highlight_videos?: string[] | null
          id?: string
          role?: string
          social_media_stats?: Json | null
        }
        Update: {
          avatar_url?: string | null
          content_style?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          highlight_videos?: string[] | null
          id?: string
          role?: string
          social_media_stats?: Json | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
