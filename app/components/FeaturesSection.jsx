import { Camera, DollarSign, Users, Leaf } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Camera,
      title: 'AI Waste Recognition',
      description: 'Simply snap a photo - our AI instantly identifies waste type and quality with 95% accuracy.',
      color: 'from-lime-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-lime-50 to-emerald-50'
    },
    {
      icon: DollarSign,
      title: 'Smart Pricing',
      description: 'Real-time market valuation based on demand, quality and location factors.',
      color: 'from-amber-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      icon: Users,
      title: 'Industry Network',
      description: 'Direct access to 500+ verified buyers across biomass, packaging, and biofuel sectors.',
      color: 'from-blue-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      icon: Leaf,
      title: 'Eco Impact',
      description: 'Track your CO₂ reduction and sustainability contributions in real-time.',
      color: 'from-emerald-500 to-lime-500',
      gradient: 'bg-gradient-to-br from-emerald-50 to-lime-50'
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-700 font-extrabold uppercase tracking-wide text-lg">Features</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-extrabold text-emerald-800 drop-shadow-lg">
            Revolutionizing Agricultural Waste
          </h2>
          <p className="mt-4 text-xl text-emerald-900 max-w-2xl mx-auto drop-shadow-md font-semibold">
            Our platform combines cutting-edge technology with sustainable solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`bg-white p-8 rounded-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-500 shadow-xl hover:shadow-2xl cursor-pointer group`}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform shadow-md border-2 border-emerald-500`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-800 mb-3 drop-shadow-md border-b-2 border-emerald-500 pb-1">{feature.title}</h3>
              <p className="text-emerald-900 leading-relaxed drop-shadow-sm font-semibold">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}