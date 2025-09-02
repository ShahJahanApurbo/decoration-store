import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="container mx-auto max-w-4xl">
        <Badge variant="secondary" className="mb-4">
          <Clock className="mr-2 h-3 w-3" />
          Established 2020
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
          Transforming Homes,
          <br />
          Creating Dreams
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          At DecoStore, we believe that every home deserves to be beautiful. We
          specialize in premium home decoration items that transform ordinary
          spaces into extraordinary havens of comfort and style.
        </p>
      </div>
    </section>
  );
}
