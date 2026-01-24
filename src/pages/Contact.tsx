import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle, Send, Twitter, Youtube, Twitch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const contactReasons = [
  "General Inquiry",
  "Partnership / Sponsorship",
  "Media Request",
  "Player Agent",
  "Technical Support",
  "Other",
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com", handle: "@PrimeEsports" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@primeesports-gg?si=sraLWMSbGKX04BZ6 ", handle: "Prime Esports" },
  { name: "Twitch", icon: Twitch, href: "https://twitch.tv", handle: "PrimeEsportsTV" },
  { name: "Discord", icon: MessageCircle, href: "https://discord.com", handle: "Prime Esports" },
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });

    setFormData({
      name: "",
      email: "",
      reason: "",
      company: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Get in Touch
            </Badge>
            <h1 className="mb-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-gray-300">
              Have a question, partnership inquiry, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Contact *</Label>
                      <Select
                        value={formData.reason}
                        onValueChange={(value) => setFormData({ ...formData, reason: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactReasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div>
                <h2 className="mb-6 font-display text-2xl font-bold">Quick Contact</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-muted-foreground">prime.esports.com@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-muted-foreground">NUST H12, Islamabad</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Inquiries */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Business Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>Partnerships:</strong>{" "}
                    <a href="mailto:partnerships@primeesports.gg" className="text-primary hover:underline">
                      partnerships@primeesports.gg
                    </a>
                  </p>
                  <p>
                    <strong>Media & Press:</strong>{" "}
                    <a href="mailto:media@primeesports.gg" className="text-primary hover:underline">
                      media@primeesports.gg
                    </a>
                  </p>
                  <p>
                    <strong>Player Agents:</strong>{" "}
                    <a href="mailto:talent@primeesports.gg" className="text-primary hover:underline">
                      talent@primeesports.gg
                    </a>
                  </p>
                </CardContent>
              </Card>

              {/* Social Media */}
              <div>
                <h2 className="mb-6 font-display text-2xl font-bold">Follow Us</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <social.icon className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-semibold">{social.name}</p>
                        <p className="text-sm text-muted-foreground">{social.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-2xl font-bold uppercase">
            Common <span className="text-primary">Questions</span>
          </h2>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {[
              { q: "How can I join Prime Esports?", a: "Check our Tryouts page for open positions and apply there." },
              { q: "Do you accept sponsorship inquiries?", a: "Yes! Email partnerships@primeesports.gg with your proposal." },
              { q: "How do I report a technical issue?", a: "Use the contact form above and select 'Technical Support'." },
              { q: "Can I use your logo for content?", a: "Contact our media team for brand guidelines and permissions." },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
