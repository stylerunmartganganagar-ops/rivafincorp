import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
      chargebacks: {
        Row: {
          amount: number
          currency: string
          dispute_id: string
          document_urls: string[] | null
          due_date: string
          id: string
          initiated_at: string
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: Database["public"]["Enums"]["chargeback_status"]
        }
        Insert: {
          amount: number
          currency?: string
          dispute_id: string
          document_urls?: string[] | null
          due_date: string
          id: string
          initiated_at?: string
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["chargeback_status"]
        }
        Update: {
          amount?: number
          currency?: string
          dispute_id?: string
          document_urls?: string[] | null
          due_date?: string
          id?: string
          initiated_at?: string
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["chargeback_status"]
        }
        Relationships: [
          {
            foreignKeyName: "chargebacks_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          amount: number
          chargeback_id: string | null
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          evidence_urls: string[] | null
          id: string
          reason: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          chargeback_id?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          evidence_urls?: string[] | null
          id: string
          reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          chargeback_id?: string | null
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          evidence_urls?: string[] | null
          id?: string
          reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_type: Database["public"]["Enums"]["document_type"]
          file_url: string
          filename: string
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          uploaded_at: string
          user_id: string
        }
        Insert: {
          document_type: Database["public"]["Enums"]["document_type"]
          file_url: string
          filename: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
          user_id: string
        }
        Update: {
          document_type?: Database["public"]["Enums"]["document_type"]
          file_url?: string
          filename?: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_links: {
        Row: {
          amount: number | null
          created_at: string
          currency: string
          description: string | null
          expires_at: string | null
          id: string
          paid_transaction_id: string | null
          status: Database["public"]["Enums"]["payment_link_status"]
          title: string
          updated_at: string
          url_slug: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id: string
          paid_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_link_status"]
          title: string
          updated_at?: string
          url_slug: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          paid_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_link_status"]
          title?: string
          updated_at?: string
          url_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_paid_transaction_id_fkey"
            columns: ["paid_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"]
          amount: number
          bank_name: string
          currency: string
          fee: number | null
          id: string
          ifsc_code: string
          net_amount: number | null
          notes: string | null
          processed_at: string | null
          reference_id: string | null
          requested_at: string
          status: Database["public"]["Enums"]["payout_status"]
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: Database["public"]["Enums"]["account_type"]
          amount: number
          bank_name: string
          currency?: string
          fee?: number | null
          id: string
          ifsc_code: string
          net_amount?: number | null
          notes?: string | null
          processed_at?: string | null
          reference_id?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: Database["public"]["Enums"]["account_type"]
          amount?: number
          bank_name?: string
          currency?: string
          fee?: number | null
          id?: string
          ifsc_code?: string
          net_amount?: number | null
          notes?: string | null
          processed_at?: string | null
          reference_id?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["payout_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          bank_details: Json | null
          currency: string
          id: string
          processed_at: string | null
          reason: string | null
          reference_id: string | null
          refund_method: Database["public"]["Enums"]["refund_method"]
          requested_at: string
          requested_by: string
          status: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          currency?: string
          id: string
          processed_at?: string | null
          reason?: string | null
          reference_id?: string | null
          refund_method?: Database["public"]["Enums"]["refund_method"]
          requested_at?: string
          requested_by: string
          status?: Database["public"]["Enums"]["refund_status"]
          transaction_id: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          currency?: string
          id?: string
          processed_at?: string | null
          reason?: string | null
          reference_id?: string | null
          refund_method?: Database["public"]["Enums"]["refund_method"]
          requested_at?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["refund_status"]
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          amount: number
          bank_reference: string | null
          created_at: string
          currency: string
          fee: number
          id: string
          net_amount: number
          processed_at: string | null
          settlement_date: string | null
          status: Database["public"]["Enums"]["settlement_status"]
          tax: number
          transaction_count: number
          user_id: string
          utr: string | null
        }
        Insert: {
          amount: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          fee?: number
          id: string
          net_amount?: number
          processed_at?: string | null
          settlement_date?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          tax?: number
          transaction_count?: number
          user_id: string
          utr?: string | null
        }
        Update: {
          amount?: number
          bank_reference?: string | null
          created_at?: string
          currency?: string
          fee?: number
          id?: string
          net_amount?: number
          processed_at?: string | null
          settlement_date?: string | null
          status?: Database["public"]["Enums"]["settlement_status"]
          tax?: number
          transaction_count?: number
          user_id?: string
          utr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supported_banks: {
        Row: {
          category: Database["public"]["Enums"]["bank_category"]
          id: string
          ifsc_prefix: string | null
          is_active: boolean
          logo_url: string | null
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["bank_category"]
          id: string
          ifsc_prefix?: string | null
          is_active?: boolean
          logo_url?: string | null
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["bank_category"]
          id?: string
          ifsc_prefix?: string | null
          is_active?: boolean
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          fee: number
          id: string
          ip_address: unknown | null
          metadata: Json | null
          net_amount: number
          order_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          processed_at: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          tax: number
          transaction_ref: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          fee?: number
          id: string
          ip_address?: unknown | null
          metadata?: Json | null
          net_amount?: number
          order_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          tax?: number
          transaction_ref?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          fee?: number
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          net_amount?: number
          order_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          tax?: number
          transaction_ref?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number
          chargebacks_count: number
          created_at: string
          email: string
          flags_count: number
          hold_amount: number
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          kyc_submitted_at: string | null
          name: string
          password_hash: string | null
          phone: string | null
          restricted: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          balance?: number
          chargebacks_count?: number
          created_at?: string
          email: string
          flags_count?: number
          hold_amount?: number
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          kyc_submitted_at?: string | null
          name: string
          password_hash?: string | null
          phone?: string | null
          restricted?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          balance?: number
          chargebacks_count?: number
          created_at?: string
          email?: string
          flags_count?: number
          hold_amount?: number
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          kyc_submitted_at?: string | null
          name?: string
          password_hash?: string | null
          phone?: string | null
          restricted?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          business_name: string | null
          business_type: string | null
          business_email: string | null
          business_phone: string | null
          business_address: string | null
          bank_name: string | null
          account_number: string | null
          ifsc_code: string | null
          account_holder_name: string | null
          enabled_payment_methods: string[] | null
          settlement_frequency: string | null
          settlement_time: string | null
          webhook_url: string | null
          webhook_secret: string | null
          webhook_events: string[] | null
          api_version: string | null
          rate_limiting_enabled: boolean | null
          rate_limit_per_minute: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name?: string | null
          business_type?: string | null
          business_email?: string | null
          business_phone?: string | null
          business_address?: string | null
          bank_name?: string | null
          account_number?: string | null
          ifsc_code?: string | null
          account_holder_name?: string | null
          enabled_payment_methods?: string[] | null
          settlement_frequency?: string | null
          settlement_time?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          webhook_events?: string[] | null
          api_version?: string | null
          rate_limiting_enabled?: boolean | null
          rate_limit_per_minute?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string | null
          business_type?: string | null
          business_email?: string | null
          business_phone?: string | null
          business_address?: string | null
          bank_name?: string | null
          account_number?: string | null
          ifsc_code?: string | null
          account_holder_name?: string | null
          enabled_payment_methods?: string[] | null
          settlement_frequency?: string | null
          settlement_time?: string | null
          webhook_url?: string | null
          webhook_secret?: string | null
          webhook_events?: string[] | null
          api_version?: string | null
          rate_limiting_enabled?: boolean | null
          rate_limit_per_minute?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_applications: {
        Row: {
          id: string
          user_id: string | null
          entity_type: string
          full_name: string
          email: string
          phone: string
          business_name: string
          business_address: string
          status: string
          documents: Json
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          entity_type: string
          full_name: string
          email: string
          phone: string
          business_name: string
          business_address: string
          status?: string
          documents?: Json
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          entity_type?: string
          full_name?: string
          email?: string
          phone?: string
          business_name?: string
          business_address?: string
          status?: string
          documents?: Json
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "savings" | "current"
      bank_category: "Major Banks" | "Regional Banks" | "Digital Banks" | "Small Finance Banks" | "Payments Banks" | "Regional Rural Banks" | "Cooperative Banks"
      chargeback_status: "initiated" | "representment" | "accepted" | "rejected"
      dispute_status: "open" | "investigating" | "resolved" | "won" | "lost"
      document_status: "pending" | "approved" | "rejected"
      document_type: "passport" | "aadhar" | "pan" | "bank_statement" | "utility_bill" | "photo"
      kyc_status: "pending" | "approved" | "rejected" | "incomplete"
      payment_link_status: "active" | "expired" | "paid"
      payment_method: "UPI" | "Card" | "Net Banking" | "Wallet"
      payout_status: "pending" | "processing" | "completed" | "failed" | "cancelled"
      refund_method: "original" | "bank_transfer" | "wallet"
      refund_status: "pending" | "processing" | "completed" | "failed"
      settlement_status: "pending" | "processing" | "settled" | "failed"
      transaction_status: "success" | "failed" | "pending" | "refunded"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
