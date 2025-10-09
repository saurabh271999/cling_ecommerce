"use client";

import Image from "next/image";

import mailLogo from "@/assets/logo/mailLogo.png";
import phoneLogo from "@/assets/logo/phoneLogo.png";
import geoLogo from "@/assets/logo/geoLocationLogo.png";
import potteryImage from "@/assets/banners/potteryImage.png";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    console.log(data);
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto w-full rounded-lg overflow-hidden mt-10">
      {/* Left side with image and address */}
      <div className="w-full md:w-1/2 p-6 md:p-8 h-full border-r border-slate-300">
        <div className="mb-6">
          <Image
            src={potteryImage || "/placeholder.svg"}
            alt="Pottery tools and clay"
            className="w-full h-64 object-cover rounded-lg"
            priority
          />
        </div>

        <h2 className="text-2xl font-medium text-gray-800 mb-4">Address</h2>

        <div className="space-y-6">
          <div className="flex">
            <Image
              src={geoLogo || "/placeholder.svg"}
              alt="Location"
              className="w-5 h-5 mt-1 text-amber-500"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-800">Head Office</p>
              <p className="text-gray-600 text-sm mt-1">
                2nd Floor, Raj Square, Pashan - Sus Rd, near Abhinav kala
                college, opposite Reliance Fresh, Sutarwadi, Pashan, Pune,
                Maharashtra - 411021
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Image
              src={phoneLogo || "/placeholder.svg"}
              alt="Phone"
              className="w-5 h-5 text-amber-500"
            />
            <p className="ml-3 text-gray-600">+91 8767070762</p>
          </div>

          <div className="flex items-center">
            <Image
              src={mailLogo || "/placeholder.svg"}
              alt="Email"
              className="w-5 h-5 text-amber-500"
            />
            <p className="ml-3 text-gray-600">info@clingmultisolutions.org</p>
          </div>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 p-6 md:p-8 bg-white h-full">
        <div className="w-full">
          <h1 className="text-3xl font-medium text-gray-800 mb-2">
            Get in touch
          </h1>
          <p className="text-gray-500 mb-8 md:pb-8 md:border-b md:border-slate-300">
            &quot;Fill out the form below and send us an email. Our team will
            get back to you as soon as possible!&quot;
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        className="w-full rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        className="w-full rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email-id</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        className="w-full rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Phone number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter number"
                        className="w-full rounded-md border-gray-300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                SUBMIT
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
