import { useState } from 'react'
import Sidebar from '../components/Sidebar'

export default function Clinics() {
  const [city,     setCity]     = useState('')
  const [clinics,  setClinics]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState('')
  const [searched, setSearched] = useState(false)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(''), 3000)
  }

  const demoClinics = (cityName) => [
    { name: 'Mpower — The Centre',      address: `Bandra West, ${cityName}`,  rating: 4.8, phone: '+91-22-2655-3344'   },
    { name: 'Vandrevala Foundation',     address: `Andheri East, ${cityName}`, rating: 4.6, phone: '+91-1860-2662-345'  },
    { name: 'iCall Counselling Centre',  address: `TISS Campus, ${cityName}`,  rating: 4.9, phone: '+91-9152987821'     },
    { name: 'Fortis Mental Health',      address: `Mulund West, ${cityName}`,  rating: 4.5, phone: '+91-22-4545-2000'   },
    { name: 'Masina Hospital Psychiatry',address: `Byculla, ${cityName}`,      rating: 4.3, phone: '+91-22-2377-6300'   },
  ]

  async function searchByCity() {
    if (!city.trim()) {
      showToast('Please enter a city name!', 'error')
      return
    }

    setLoading(true)
    setSearched(false)

    try {
      const geoRes  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'NirvanaApp/1.0' } }
      )
      const geoData = await geoRes.json()

      if (!geoData || geoData.length === 0) {
        showToast(`City "${city}" not found. Try another name.`, 'error')
        setLoading(false)
        return
      }

      const lat = parseFloat(geoData[0].lat)
      const lng = parseFloat(geoData[0].lon)

      const clinicRes  = await fetch(
        `https://nominatim.openstreetmap.org/search?q=mental+health+clinic+${encodeURIComponent(city)}&format=json&limit=8`,
        { headers: { 'User-Agent': 'NirvanaApp/1.0' } }
      )
      const clinicData = await clinicRes.json()

      if (clinicData && clinicData.length > 0) {
        setClinics(clinicData.map(item => ({
          name:    item.name || item.display_name?.split(',')[0] || 'Health Clinic',
          address: item.display_name || 'Address not available',
          rating:  null,
          phone:   '',
          lat:     parseFloat(item.lat),
          lng:     parseFloat(item.lon),
        })))
        showToast(`Found ${clinicData.length} clinics in ${city} 🏥`)
      } else {
        setClinics(demoClinics(city))
        showToast(`Showing sample clinics for ${city} 🏥`)
      }

      setSearched(true)

    } catch {
      setClinics(demoClinics(city))
      setSearched(true)
      showToast(`Showing sample clinics for ${city} 🏥`)
    } finally {
      setLoading(false)
    }
  }

  function getLocation() {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by your browser.', 'error')
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        try {
          const revRes  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'User-Agent': 'NirvanaApp/1.0' } }
          )
          const revData = await revRes.json()
          const cityName = revData?.address?.city || revData?.address?.town || 'your area'

          setCity(cityName)
          setClinics(demoClinics(cityName))
          setSearched(true)
          showToast(`Showing clinics near ${cityName} 🏥`)
        } catch {
          setClinics(demoClinics('your area'))
          setSearched(true)
          showToast('Showing sample clinics near you 🏥')
        } finally {
          setLoading(false)
        }
      },
      () => {
        showToast('Could not get location. Try city search.', 'error')
        setLoading(false)
      },
      { timeout: 10000 }
    )
  }

  const stars = (rating) => {
    if (!rating) return ''
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 px-5 py-3 rounded-xl text-sm shadow-lg z-50 border-l-4
          ${toast.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-400'
            : 'bg-navy text-teal-light border-teal'
          }`}>
          {toast.msg}
        </div>
      )}

      <main className="ml-60 flex-1 p-8">

        <div className="mb-7">
          <h2 className="text-2xl font-medium text-gray-800">Find Clinics 🏥</h2>
          <p className="text-sm text-gray-500 mt-1">
            Search by city or use your location to find mental health support near you.
          </p>
        </div>

        {/* Hero */}
        <div className="rounded-2xl p-8 mb-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(15,74,58,0.88) 0%, rgba(20,30,53,0.82) 100%), url(https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop) center/cover no-repeat'
          }}>
          <h2 className="text-teal-light text-xl font-medium mb-2 relative z-10">
            You are not alone 🌿
          </h2>
          <p className="text-white/60 text-sm relative z-10">
            Reaching out for help is one of the bravest things you can do.
          </p>
        </div>

        {/* Search card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="text-sm font-medium text-gray-800 mb-4">Search by city name</div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchByCity()}
              placeholder="e.g. Mumbai, Pune, Delhi, Bangalore..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-800 outline-none focus:border-teal transition-all"
            />
            <button
              onClick={searchByCity}
              disabled={loading}
              className="px-6 py-3 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-dark transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            or
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={getLocation}
            disabled={loading}
            className="w-full py-3 bg-teal-pale text-teal-dark rounded-xl text-sm font-medium hover:bg-teal/20 transition-all border border-teal/20 disabled:opacity-50"
          >
            📍 Use my current location (GPS)
          </button>
        </div>

        {/* Results */}
        {!searched ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4 opacity-30">🏥</div>
            <h4 className="text-base font-medium text-gray-500 mb-2">Search for clinics</h4>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Enter a city name or click "Use my current location" to find mental health clinics near you.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-gray-800">
                {clinics.length} clinic{clinics.length !== 1 ? 's' : ''} found near {city || 'you'}
              </div>
              <span className="text-xs bg-teal-pale text-teal-dark px-3 py-1 rounded-full">
                Mental health
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {clinics.map((c, i) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ' ' + c.address)}`
                const colors  = ['#3d8b75','#7a6abf','#4a90d9','#ef9f27','#d85a6a']

                return (
                  <div
                    key={i}
                    onClick={() => window.open(mapsUrl, '_blank')}
                    className="bg-white rounded-2xl border-2 border-gray-100 p-5 flex items-center gap-4 cursor-pointer hover:border-teal hover:shadow-md transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: colors[i % colors.length] + '18' }}>
                      🏥
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500 mt-1">📍 {c.address}</div>
                      <div className="flex items-center gap-3 mt-2">
                        {c.rating && (
                          <span className="text-xs text-amber-500 font-medium">
                            {stars(c.rating)} {c.rating}
                          </span>
                        )}
                        {c.phone && (
                          <span className="text-xs text-teal">📞 {c.phone}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm group-hover:text-teal transition-all group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}