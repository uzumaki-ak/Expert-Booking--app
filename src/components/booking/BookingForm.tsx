// Booking form — RHF + Zod, idempotency UUID via expo-crypto, haptic feedback on submit

import { useRef } from "react";
import { View, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import * as Crypto from "expo-crypto";
import { toast } from "sonner-native";
import { useRouter } from "expo-router";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createBooking } from "@/api/bookings";
import { haptics } from "@/hooks/useHaptics";
import { usePersistedEmail } from "@/hooks/usePersistedEmail";
import type { Expert } from "@/types";

const schema = z.object({
  name: z.string().trim().min(2, "Min 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s\-()]{7,20}$/, "Invalid phone number"),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface BookingFormProps {
  expert: Expert;
  date: string;
  timeSlot: string;
  onSuccess: (bookingId: string) => void;
}

export const BookingForm = ({ expert, date, timeSlot, onSuccess }: BookingFormProps) => {
  const router = useRouter();
  const qc = useQueryClient();
  const { email: persistedEmail, setEmail } = usePersistedEmail();

  // expo-crypto.randomUUID is reliable across iOS/Android; native crypto isn't always polyfilled
  const idempotencyKey = useRef(Crypto.randomUUID());

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: persistedEmail ?? "",
      phone: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createBooking({
        expertId: expert._id,
        idempotencyKey: idempotencyKey.current,
        ...values,
        date,
        timeSlot,
      }),
    onSuccess: async (booking) => {
      await setEmail(booking.email);
      qc.invalidateQueries({ queryKey: ["expert", expert._id] });
      qc.invalidateQueries({ queryKey: ["bookings", booking.email] });
      haptics.success();
      toast.success("BOOKING CONFIRMED", {
        description: `${expert.name} · ${date} at ${timeSlot} UTC`,
      });
      onSuccess(booking._id);
    },
    onError: (err: Error) => {
      const isConflict = /unavailable|already booked|conflict|duplicate/i.test(err.message);
      haptics.error();
      toast.error(isConflict ? "SLOT JUST BOOKED" : "BOOKING FAILED", {
        description: isConflict ? "Please pick another time." : err.message,
      });
      if (isConflict) {
        setTimeout(() => router.replace(`/expert/${expert._id}`), 700);
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Full Name"
            placeholder="Your full name"
            autoComplete="name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            autoComplete="tel"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <Textarea
            label="Notes (optional)"
            placeholder="Anything you'd like the expert to know"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.notes?.message}
          />
        )}
      />

      <View className="mt-4 gap-3">
        <Button
          variant="primary"
          size="lg"
          loading={mutation.isPending}
          onPress={onSubmit}
          fullWidth
        >
          Confirm Booking
        </Button>
        <Button variant="hairline" size="lg" onPress={() => router.back()} fullWidth>
          Cancel
        </Button>
      </View>

      <Text className="text-muted text-xs mt-2" style={{ letterSpacing: 1, lineHeight: 18 }}>
        On submit, a server-side transaction reserves your slot. If another user wins the race
        you'll be returned to pick another slot — your form data won't be lost.
      </Text>
    </View>
  );
};
