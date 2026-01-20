import { Link } from "react-router-dom";
import { Target, Users, Trophy, Heart, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { staff } from "@/data/mockData";

const values = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for greatness in every competition, pushing boundaries and setting new standards.",
  },
  {
    icon: Users,
    title: "Teamwork",
    description: "Success comes from collaboration. We build strong bonds and support each other.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for competitive gaming drives everything we do, from practice to performance.",
  },
  {
    icon: Target,
    title: "Dedication",
    description: "We're committed to constant improvement, putting in the work to achieve our goals.",
  },
];

const milestones = [
  { year: "2019", title: "Founded", description: "Prime Esports was established with a vision to compete at the highest level." },
  { year: "2020", title: "First Major Win", description: "Our VALORANT team wins their first regional championship." },
  { year: "2021", title: "Multi-Title Expansion", description: "Expanded into League of Legends, CS:GO, and fighting games." },
  { year: "2022", title: "International Success", description: "Teams qualify for major international tournaments across all titles." },
  { year: "2023", title: "Record-Breaking Year", description: "Won 8 major tournaments and reached 1M social media followers." },
  { year: "2024", title: "VCT Champions", description: "Our VALORANT team wins the VCT Americas championship." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Our Story
            </Badge>
            <h1 className="mb-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">
              About <span className="text-primary">Prime Esports</span>
            </h1>
            <p className="text-lg text-gray-300">
              Building champions, creating legends, and pushing the boundaries of competitive gaming since 2019.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold uppercase">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Prime Esports exists to discover, develop, and support the world's most talented competitive gamers. 
              We provide the resources, coaching, and environment needed for players to reach their full potential 
              and compete at the highest level of professional esports.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-y bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase">
            Our <span className="text-primary">Values</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase">
            Our <span className="text-primary">Journey</span>
          </h2>
          <div className="mx-auto max-w-3xl">
            <div className="relative border-l-2 border-primary/30 pl-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative mb-8 last:mb-0">
                  {/* Dot */}
                  <div className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  {/* Content */}
                  <div className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline">{milestone.year}</Badge>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="mb-1 font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="border-t bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase">
            Leadership <span className="text-primary">Team</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((member) => (
              <Card key={member.id} className="card-hover overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-muted">
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-6xl font-bold text-primary/30">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-display font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Pro Players", value: "50+" },
              { label: "Championships", value: "25+" },
              { label: "Countries Represented", value: "15" },
              { label: "Social Followers", value: "1M+" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-esports-dark py-16">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            Ready to Be Part of the Story?
          </h2>
          <p className="mb-6 text-gray-300">
            Join Prime Esports and write the next chapter with us.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/tryouts">
                View Tryouts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
