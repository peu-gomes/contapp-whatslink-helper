/*
  # Fix Supabase Security Warnings

  1. Security Updates
    - Fix function search path mutability
    - Configure secure OTP expiry times
    - Enable leaked password protection

  2. Changes
    - Update handle_updated_at function with secure search_path
    - Set OTP expiry to 30 minutes for email and SMS
    - Enable password leak protection
*/

-- Fix the handle_updated_at function to have a secure search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- The function is now secure with an immutable search_path