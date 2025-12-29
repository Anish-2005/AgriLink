export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Upload Waste Photo',
      description: 'Use our mobile app or website to photograph your agricultural waste. Our system accepts images of crop residue, husks, straw, and more.',
      tags: ['Mobile App', 'Web Upload'],
      color: 'from-emerald-500 to-teal-500'
    },
    {
      number: 2,
      title: 'AI Analysis',
      description: 'Our advanced machine learning models analyze the image to classify waste type, estimate quantity, and assess quality within seconds.',
      tags: ['95% Accuracy', 'Instant Results'],
      color: 'from-amber-500 to-orange-500'
    },
    {
      number: 3,
      title: 'Receive Offers',
      description: 'Get multiple competitive offers from verified industrial buyers. Compare prices, buyer ratings, and pickup options.',
      tags: ['Verified Buyers Only'],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      number: 4,
      title: 'Complete Transaction',
      description: 'Finalize the deal, arrange logistics, and get paid directly to your bank account. Track your environmental impact in your dashboard.',
      tags: ['Secure Payments'],
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold uppercase tracking-wide text-sm">Process</span>
          <h2 className="mt-3 text-4xl lg:text-5xl font-bold text-gray-900">
            Simple 4-Step Process
          </h2>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="flex-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-700 text-2xl font-extrabold mb-6 shadow-lg`}>{step.number}</div>
                <h3 className="text-3xl font-extrabold text-emerald-800 mb-4 border-b-2 border-emerald-500 pb-1">{step.title}</h3>
                <p className="text-lg text-emerald-900 leading-relaxed mb-6 font-semibold">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className={`relative p-8 bg-white border-2 border-emerald-500 rounded-3xl shadow-2xl`}>
                  <div className="absolute inset-0 bg-emerald-50/30 rounded-3xl backdrop-blur-sm"></div>
                  <div className="relative h-64 flex items-center justify-center">
                    {idx === 0 && (
                      <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                        alt="Upload Waste Photo"
                        className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                      />
                    )}
                    {idx === 1 && (
                      <img
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80"
                        alt="AI Analysis"
                        className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                      />
                    )}
                    {idx === 2 && (
                      <img
                        src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                        alt="Receive Offers"
                        className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                      />
                    )}
                    {idx === 3 && (
                      <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80"
                        alt="Complete Transaction"
                        className="h-48 w-48 object-cover rounded-2xl border-2 border-emerald-200 shadow-md"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}