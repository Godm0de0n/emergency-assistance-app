import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const phoneNumberSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().regex(
    /^\d{10}$|^\(\d{3}\)\s?\d{3}-\d{4}$|^\d{3}-\d{3}-\d{4}$/,
    "Please enter a valid phone number"
  ),
});

type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

interface PhoneNumberFormProps {
  showAlert: (message: string, type: "success" | "error" | "warning") => void;
  setPhoneInfo: (phoneInfo: { countryCode: string; phoneNumber: string } | null) => void;
}

export default function PhoneNumberForm({ showAlert, setPhoneInfo }: PhoneNumberFormProps) {
  const form = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      countryCode: "+1",
      phoneNumber: "",
    },
  });

  const savePhoneMutation = useMutation({
    mutationFn: async (data: PhoneNumberFormValues) => {
      const response = await apiRequest("POST", "/api/phone", data);
      return response.json();
    },
    onSuccess: (data) => {
      showAlert("Contact information saved successfully", "success");
      setPhoneInfo({
        countryCode: form.getValues("countryCode"),
        phoneNumber: form.getValues("phoneNumber"),
      });
    },
    onError: (error) => {
      showAlert(`Failed to save contact information: ${(error as Error).message}`, "error");
    },
  });

  const onSubmit = (data: PhoneNumberFormValues) => {
    savePhoneMutation.mutate(data);
  };

  return (
    <Card className="mb-8 bg-gray-50 border border-gray-200">
      <CardContent className="pt-5">
        <h2 className="text-lg font-bold mb-4">Your Contact Information</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
              <div className="flex gap-2 flex-wrap">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="+1">+1 (US)</SelectItem>
                          <SelectItem value="+44">+44 (UK)</SelectItem>
                          <SelectItem value="+61">+61 (AU)</SelectItem>
                          <SelectItem value="+91">+91 (IN)</SelectItem>
                          <SelectItem value="+33">+33 (FR)</SelectItem>
                          <SelectItem value="+49">+49 (DE)</SelectItem>
                          <SelectItem value="+86">+86 (CN)</SelectItem>
                          <SelectItem value="+81">+81 (JP)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-[#FF0000] mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[160px]">
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007AFF] w-full"
                          placeholder="(555) 123-4567"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-[#FF0000] mt-1" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-2 bg-[#007AFF] hover:bg-blue-600 text-white font-semibold rounded-lg"
              disabled={savePhoneMutation.isPending}
            >
              {savePhoneMutation.isPending ? "Saving..." : "Save Contact Info"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
