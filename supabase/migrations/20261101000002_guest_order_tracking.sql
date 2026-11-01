-- =====================================================================
-- GULNAAR by MK — Migration 20261101000002
-- Secure Guest Order Lookup RPC with SECURITY DEFINER
-- =====================================================================

create or replace function public.lookup_guest_order(
    p_order_number text,
    p_phone text
)
returns jsonb
language plpgsql
security definer -- Runs with elevated privileges to find order safely without exposing table RLS
set search_path = public
as $$
declare
    v_order record;
    v_items jsonb;
    v_norm_input_phone text;
    v_norm_order_phone text;
    v_masked_phone text;
begin
    -- 1. Input sanitization
    if length(trim(p_order_number)) < 3 or length(trim(p_phone)) < 7 then
        return jsonb_build_object('success', false, 'error', 'Invalid order number or phone number format.');
    end if;

    -- Normalize input phone: keep only digits
    v_norm_input_phone := regexp_replace(p_phone, '[^0-9]', '', 'g');

    -- 2. Find order by order_number
    select * into v_order
    from public.orders
    where upper(trim(order_number)) = upper(trim(p_order_number))
    limit 1;

    if not found then
        return jsonb_build_object('success', false, 'error', 'No order found matching these details.');
    end if;

    -- 3. Verify phone number matches last 7 digits to prevent brute-force order scanning
    v_norm_order_phone := regexp_replace(v_order.customer_phone, '[^0-9]', '', 'g');

    if length(v_norm_input_phone) < 7 or length(v_norm_order_phone) < 7 or
       right(v_norm_input_phone, 7) != right(v_norm_order_phone, 7) then
        return jsonb_build_object('success', false, 'error', 'No order found matching these details.');
    end if;

    -- 4. Mask phone number (e.g. 0321•••543)
    if length(v_order.customer_phone) >= 8 then
        v_masked_phone := substr(v_order.customer_phone, 1, 4) || '•••' || right(v_order.customer_phone, 3);
    else
        v_masked_phone := '••••••••';
    end if;

    -- 5. Fetch associated order items
    select coalesce(jsonb_agg(
        jsonb_build_object(
            'product_name', oi.product_name,
            'variant_size', oi.variant_size,
            'variant_color', oi.variant_color,
            'quantity', oi.quantity,
            'unit_price_minor', oi.unit_price_minor
        )
    ), '[]'::jsonb)
    into v_items
    from public.order_items oi
    where oi.order_id = v_order.id;

    -- 6. Return strictly scoped public order status (never returning address lines or email)
    return jsonb_build_object(
        'success', true,
        'order', jsonb_build_object(
            'order_number', v_order.order_number,
            'fulfillment_status', v_order.fulfillment_status,
            'payment_method', v_order.payment_method,
            'payment_status', v_order.payment_status,
            'customer_name', v_order.customer_name,
            'masked_phone', v_masked_phone,
            'city', v_order.city,
            'subtotal_minor', v_order.subtotal_minor,
            'delivery_charge_minor', v_order.delivery_charge_minor,
            'total_minor', v_order.total_minor,
            'created_at', v_order.created_at,
            'items', v_items
        )
    );
end;
$$;

