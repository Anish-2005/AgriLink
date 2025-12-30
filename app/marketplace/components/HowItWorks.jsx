export default function HowItWorks() {
  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-emerald-800 drop-shadow-lg mb-4">How the Marketplace Works</h2>
        <p className="text-xl text-emerald-900 drop-shadow-md font-semibold max-w-3xl mx-auto">Simple 3-step process to transform your waste into revenue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: 1, title: 'Find Tenders', desc: 'Browse industrial tenders looking for agricultural waste materials', color: 'from-emerald-500 to-teal-500' },
          { step: 2, title: 'Submit Bid', desc: 'Place competitive bids for your available agricultural waste', color: 'from-amber-500 to-orange-500' },
          { step: 3, title: 'Complete Transaction', desc: 'Finalize deal, arrange logistics, and get paid upon delivery', color: 'from-blue-500 to-indigo-500' }
        ].map((step, idx) => (
          <div key={idx} className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay={idx * 200}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} mb-6`}>
              <span className="text-2xl font-extrabold text-white">{step.step}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">{step.title}</h3>
            <p className="text-emerald-900 leading-relaxed font-semibold">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
