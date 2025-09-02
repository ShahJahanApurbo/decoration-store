export default function ContactCTASection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Home?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Discover our curated collection of premium home decoration items and
          start your journey to a more beautiful living space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/shop"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Shop Now
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
