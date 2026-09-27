import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Truck,
  Search,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface MapLink {
  uri: string;
  title: string;
}

export const GoogleMapsLogistics: React.FC = () => {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [mapLinks, setMapLinks] = useState<MapLink[]>([]);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setDestinationQuery('Nearby hotels, banquet venues, and route from MLUE bottling hub Indore');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError('Location permission denied. Please type your destination address manually.');
      }
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResultText(null);
    setMapLinks([]);

    try {
      const response = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: destinationQuery,
          latitude: userCoords?.lat,
          longitude: userCoords?.lng,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to query Google Maps intelligence.');
      }

      setResultText(data.text);
      setMapLinks(data.mapLinks || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Logistics route calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="maps-logistics-card" className="bg-white/90 rounded-2xl border border-[#006998]/20 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#006998]/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1280d6]/15 text-[#006998] flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5 text-[#1280d6]" />
          </div>
          <div>
            <h3 className="font-sans font-black text-base text-[#006998]">
              MLUE Logistics & Indore Venue Grounding
            </h3>
            <p className="text-xs text-[#003940]/75 font-medium">
              Real-time route calculation from MASAR BEVERAGES bottling facility to Indore client venues
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleUseLocation}
          className="self-start sm:self-auto text-xs font-bold px-3.5 py-1.5 rounded-lg border border-[#006998]/25 bg-white hover:bg-[#e3d3ff]/40 text-[#003940] flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Navigation className="w-3.5 h-3.5 text-[#1280d6]" />
          Use Current Geolocation
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#003940]/50" />
          <input
            id="maps-logistics-input"
            type="text"
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            placeholder="e.g. Sayaji Hotel Indore, Vijay Nagar, or Brilliant Convention Centre"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#006998]/25 bg-white text-sm text-[#003940] font-medium focus:outline-hidden focus:border-[#1280d6]"
          />
        </div>
        <button
          type="submit"
          id="maps-logistics-submit"
          disabled={loading || !destinationQuery.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#1280d6] hover:bg-[#0e6db6] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xs active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Routing...
            </>
          ) : (
            <>
              <Truck className="w-3.5 h-3.5" />
              Check Route & Links
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Destinations */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
        <span className="text-[#003940]/70 font-bold">Indore Venues:</span>
        {[
          'Sayaji Hotel, Indore',
          'The Park, Indore',
          'Brilliant Convention Centre, Indore',
          'Indore Marriott Hotel',
        ].map((venue) => (
          <button
            key={venue}
            type="button"
            onClick={() => {
              setDestinationQuery(venue);
            }}
            className="px-2.5 py-1 rounded-full bg-white/90 border border-[#006998]/20 text-[#003940] font-medium hover:border-[#1280d6] hover:text-[#1280d6] transition-colors shadow-2xs"
          >
            {venue}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mb-4 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resultText && (
        <div className="mt-4 p-4 rounded-xl bg-white/95 border border-[#006998]/20 text-xs text-[#003940] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-[#006998] font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#1280d6]" />
            <span>Maps Grounding Result:</span>
          </div>

          <div className="prose prose-stone prose-xs max-w-none whitespace-pre-line leading-relaxed text-[#003940]">
            {resultText}
          </div>

          {mapLinks.length > 0 && (
            <div className="pt-3 border-t border-[#006998]/15">
              <span className="text-[11px] font-bold text-[#006998] block mb-2">
                Verified Google Maps Places:
              </span>
              <div className="flex flex-wrap gap-2">
                {mapLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e3d3ff]/40 border border-[#006998]/20 text-[#003940] hover:border-[#1280d6] hover:text-[#1280d6] transition-colors font-semibold text-xs shadow-2xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#1280d6]" />
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3 text-[#003940]/50 ml-1" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
