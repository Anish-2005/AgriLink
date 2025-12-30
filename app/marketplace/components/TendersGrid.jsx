import TenderCard from './TenderCard';

export default function TendersGrid({ filteredTenders, loading, getDaysLeft, getStatusBadge }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!loading && filteredTenders.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-emerald-500" data-aos="fade-up">
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-lime-100 mb-6">
          <svg className="h-10 w-10 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </div>
        <h3 className="text-2xl font-extrabold text-emerald-800 mb-4">No matching tenders found</h3>
        <p className="text-emerald-700 mb-8 font-semibold">Try adjusting your search or filter criteria to find available tenders</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {filteredTenders.map((tender, index) => (
        <TenderCard key={index} tender={tender} index={index} getDaysLeft={getDaysLeft} getStatusBadge={getStatusBadge} />
      ))}
    </div>
  );
}
