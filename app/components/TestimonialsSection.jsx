import { Users, Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Rice Farmer, Punjab',
      quote: 'AgriLink has changed my life. I used to burn my rice straw, now I earn ₹15,000 per acre from selling it. The AI photo system is so easy to use!',
      gradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      name: 'Priya Sharma',
      role: 'Biomass Plant Manager',
      quote: 'We get consistent quality agricultural waste through AgriLink. The platform saves us 30% in procurement costs compared to traditional methods.',
      gradient: 'from-blue-500/10 to-indigo-500/10'
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Environmental Scientist',
      quote: 'AgriLink\'s model is revolutionary. For every 100 farmers using the platform, we prevent approximately 500 tons of CO₂ emissions annually.',
      gradient: 'from-violet-500/10 to-purple-500/10'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white border-t-4 border-emerald-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-700 font-extrabold uppercase tracking-wide text-lg">Testimonials</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-emerald-800 drop-shadow-lg">
            Trusted by Farmers & Industries
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`bg-white p-8 rounded-3xl border-2 border-emerald-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-800">{testimonial.name}</h4>
                  <p className="text-sm text-emerald-700 font-semibold">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-emerald-900 italic leading-relaxed font-semibold">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}