"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "../../../../types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const MessageComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const { username } = params;
  console.log(username);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data.content);
      console.log(username);
      const response = await axios.post<ApiResponse>(`/api/send-messages/`, {
        username: username,
        content: data.content,
      });
      console.log(response);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error while sending the data",
      });
    }
  };
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="font-bold text-4xl mb-10 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="content">
                  Send anonymous message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here."
                    className="resize-none border-black border-2 w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            {isSubmitting ? (
              <Button>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button type="submit">Send message</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
export default MessageComponent;
