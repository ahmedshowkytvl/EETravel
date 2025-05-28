import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlobeIcon, Users, Award, MapPin, History, Heart } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">{t('about.title', 'About Sahara Travel')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('about.subtitle', 'Connecting travelers with the magic and wonder of the Middle East since 2015')}
          </p>
        </div>

        {/* Hero section */}
        <div className="relative rounded-lg overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-primary/90 to-primary/80 text-white p-12 md:p-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">{t('about.story.title', 'Our Story')}</h2>
              <blockquote className="text-xl italic mb-8 border-l-4 border-white/60 pl-4">
                {t('about.story.quote', '"The world is a book, and those who do not travel read only one page."')}
                <footer className="text-sm mt-2">{t('about.story.quoteAuthor', '— St. Augustine')}</footer>
              </blockquote>
              <p className="mb-6">
                {t('about.story.paragraph1', 'Sahara Travel was founded with a vision to showcase the rich cultural heritage, breathtaking landscapes, and warm hospitality of the Middle East to the world. What began as a small operation in Cairo has grown into a trusted travel partner for thousands of adventurers seeking authentic experiences.')}
              </p>
              <p>
                {t('about.story.paragraph2', 'Our team of passionate locals and travel experts work together to create memorable journeys that go beyond the typical tourist trails, connecting you with the heart and soul of each destination.')}
              </p>
            </div>
          </div>
        </div>

        {/* Values section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.values.title', 'Our Values')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.passion.title', 'Passion')}</h3>
              <p className="text-muted-foreground">
                {t('about.values.passion.description', 'We\'re passionate about creating transformative travel experiences that inspire, educate, and bring joy to our customers.')}
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.excellence.title', 'Excellence')}</h3>
              <p className="text-muted-foreground">
                {t('about.values.excellence.description', 'We strive for excellence in every detail, ensuring high-quality experiences that exceed our customers\' expectations.')}
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.authenticity.title', 'Authenticity')}</h3>
              <p className="text-muted-foreground">
                {t('about.values.authenticity.description', 'We create genuine connections with local communities, supporting sustainable tourism that preserves cultural heritage.')}
              </p>
            </Card>
          </div>
        </section>

        {/* Team section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.team.title', 'Our Team')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{t(`about.team.members.${member.name.toLowerCase().replace(/\s+/g, '_')}.name`, member.name)}</h3>
                <p className="text-muted-foreground">{t(`about.team.members.${member.name.toLowerCase().replace(/\s+/g, '_')}.role`, member.role)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('about.journey.title', 'Our Journey')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{t('about.journey.experience.number', '10+')}</div>
              <p className="text-lg">{t('about.journey.experience.text', 'Years of Experience')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{t('about.journey.travelers.number', '25,000+')}</div>
              <p className="text-lg">{t('about.journey.travelers.text', 'Happy Travelers')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{t('about.journey.packages.number', '15+')}</div>
              <p className="text-lg">{t('about.journey.packages.text', 'Award-Winning Packages')}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">{t('about.cta.title', 'Ready to Begin Your Adventure?')}</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('about.cta.description', 'Join thousands of travelers who have experienced the magic of the Middle East with us.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/destinations">
              <Button size="lg" className="inline-flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {t('about.cta.exploreBtn', 'Explore Destinations')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="inline-flex items-center">
                <GlobeIcon className="mr-2 h-5 w-5" />
                {t('about.cta.contactBtn', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const teamMembers = [
  {
    name: "Sarah Ahmed",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200"
  },
  {
    name: "Omar Farooq",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  },
  {
    name: "Layla Karim",
    role: "Travel Experience Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200"
  },
  {
    name: "Jamal Nasir",
    role: "Customer Relations",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200"
  }
];