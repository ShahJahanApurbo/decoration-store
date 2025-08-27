import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WhatsAppButton, { WhatsAppContact } from "@/components/WhatsAppButton";
import { MessageCircle, Phone, Clock, CheckCircle } from "lucide-react";
import { whatsappConfig } from "@/lib/whatsapp-config";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Ready to transform your space? Get in touch with us on WhatsApp!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* WhatsApp Contact Card */}
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Chat with Us on WhatsApp
              </CardTitle>
              <CardDescription className="text-base">
                Get instant responses and personalized product recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <WhatsAppContact className="justify-center text-lg" />

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Hours
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Monday - Friday: {whatsappConfig.businessHours.monday}</p>
                  <p>Saturday: {whatsappConfig.businessHours.saturday}</p>
                  <p>Sunday: {whatsappConfig.businessHours.sunday}</p>
                </div>
              </div>

              <WhatsAppButton
                message={whatsappConfig.defaultMessages.general}
                className="w-full"
                size="lg"
              />
            </CardContent>
          </Card>

          {/* How to Buy Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How to Buy</CardTitle>
              <CardDescription>
                Simple steps to purchase your favorite decoration items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse Products</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore our collection of carpets, plants, mirrors, and
                      lamps
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contact via WhatsApp</h4>
                    <p className="text-sm text-muted-foreground">
                      Click any "Buy via WhatsApp" button or use the floating
                      chat button
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Get Personalized Service
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our team will help you with product details, pricing, and
                      customization
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Complete Purchase</h4>
                    <p className="text-sm text-muted-foreground">
                      Finalize your order with secure payment options and
                      delivery details
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Buy via WhatsApp?
          </h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Instant Communication</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate responses to your questions and concerns
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Personalized Service</h3>
                <p className="text-sm text-muted-foreground">
                  Receive tailored recommendations based on your specific needs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Easy & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Simple ordering process with secure payment options
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
