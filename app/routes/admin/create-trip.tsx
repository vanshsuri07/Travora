import React, { useState, useRef, useEffect } from "react";
import type { Route } from '../admin/+types/create-trip';
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utlis";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

// Loader function remains unchanged
export const loader = async () => {
    const response = await fetch('https://www.apicountries.com/countries');
    const countries = await response.json();

    return countries.map((country: any) => ({
        name: country.name,
        coordinates: country.latlng,
        value: country.name,
        openStreetMap: country.maps?.openStreetMap,
    }))
}

// Custom ComboBox Component
interface ComboBoxProps {
    id: string;
    dataSource: { text: string; value: string }[];
    placeholder: string;
    onChange: (value: string) => void;
    className?: string;
    allowFiltering?: boolean;
}

const CustomComboBox: React.FC<ComboBoxProps> = ({ 
    id, 
    dataSource, 
    placeholder, 
    onChange, 
    className = "",
    allowFiltering = true 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredData = allowFiltering 
        ? dataSource.filter(item => 
            item.text.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : dataSource;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item: { text: string; value: string }) => {
        setSelectedValue(item.text);
        setSearchTerm(item.text);
        setIsOpen(false);
        onChange(item.value);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <input
                id={id}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2 text-white placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoComplete="off"
            />
            
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white/90 backdrop-blur-md border border-white/30 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelect(item)}
                                className="px-3 py-2 hover:bg-blue-500/20 cursor-pointer text-gray-800 hover:text-blue-800 transition-colors"
                            >
                                {item.text}
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

// Custom Button Component
interface CustomButtonProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
    type = "button", 
    className = "", 
    disabled = false, 
    children, 
    onClick 
}) => {
    return (
        <button
            type={type}
            className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// Simple World Map Component using SVG
const SimpleWorldMap: React.FC<{ selectedCountry: string; countries: Country[] }> = ({ 
    selectedCountry, 
    countries 
}) => {
    const selectedCountryData = countries.find(c => c.name === selectedCountry);
    
    return (
        <div className="w-full h-64 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
                <div className="text-6xl mb-4">🌍</div>
                <div className="text-lg font-medium">
                    {selectedCountry || "Select a country to see location"}
                </div>
                {selectedCountryData?.coordinates && (
                    <div className="text-sm text-gray-300 mt-2">
                        Coordinates: {selectedCountryData.coordinates[0]}, {selectedCountryData.coordinates[1]}
                    </div>
                )}
                {selectedCountryData?.openStreetMap && (
                    <a 
                        href={selectedCountryData.openStreetMap} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-100 underline text-sm mt-1 inline-block"
                    >
                        View on OpenStreetMap
                    </a>
                )}
            </div>
        </div>
    );
};

const CreateTrip = ({ loaderData }: Route.ComponentProps ) => {
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault()
        setLoading(true);

       if(
           !formData.country ||
           !formData.travelStyle ||
           !formData.interest ||
           !formData.budget ||
           !formData.groupType
       ) {
           setError('Please provide values for all fields');
           setLoading(false)
           return;
       }

       if(formData.duration < 1 || formData.duration > 10) {
           setError('Duration must be between 1 and 10 days');
           setLoading(false)
           return;
       }
       const user = await account.get();
       if(!user.$id) {
           console.error('User not authenticated');
           setLoading(false)
           return;
       }

       try {
           const response = await fetch('/api/create-trip', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json'},
               body: JSON.stringify({
                   country: formData.country,
                   numberOfDays: formData.duration,
                   travelStyle: formData.travelStyle,
                   interests: formData.interest,
                   budget: formData.budget,
                   groupType: formData.groupType,
                   userId: user.$id
               })
           })

           const result: CreateTripResponse = await response.json();

           if(result?.id) navigate(`/user/trip/${result.id}`)
           else console.error('Failed to generate a trip')
       } catch (e) {
           console.error('Error generating trip', e);
       } finally {
           setLoading(false)
       }
    };

    const handleChange = (key: keyof TripFormData, value: string | number)  => {
        setFormData({ ...formData, [key]: value})
        // Clear error when user starts filling the form
        if (error) setError(null);
    }

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }))

    return (
        <main className="relative min-h-screen w-full flex flex-col items-center justify-center py-16 px-4 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/assets/images/background.png')` }}
            >
                {/* Optional: Add an overlay for better text readability */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            {/* Content Container (Header and Form) */}
            <div className="relative z-10 flex flex-col items-center text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                    Craft Your Next Adventure
                </h1>
                <p className="text-lg text-gray-200 mt-2 max-w-2xl" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
                    Fill in the details below and let our AI generate the perfect travel plan for you.
                </p>
            </div>

        <section className="mt-2.5 wrapper-md flex justify-center items-center">
            <form 
                className="trip-form bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 max-w-2xl w-full shadow-xl hover:shadow-2xl hover:shadow-blue-400/30 transition-all duration-300 flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                {/* Country */}
                <div>
                    <label htmlFor="country" className="text-white font-medium block mb-2">Country</label>
                    <CustomComboBox
                        id="country"
                        dataSource={countryData}
                        placeholder="Select a Country"
                        onChange={(value) => handleChange('country', value)}
                        className="w-full"
                        allowFiltering
                    />
                </div>

                {/* Duration */}
                <div>
                    <label htmlFor="duration" className="text-white font-medium block mb-2">Duration</label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        placeholder="Enter a number of days"
                        className="form-input placeholder:text-gray-200 w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => handleChange('duration', Number(e.target.value))}
                    />
                </div>

                {/* Other select items */}
                {selectItems.map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="text-white font-medium block mb-2">{formatKey(key)}</label>
                        <CustomComboBox
                            id={key}
                            dataSource={comboBoxItems[key].map((item) => ({ text: item, value: item }))}
                            placeholder={`Select ${formatKey(key)}`}
                            onChange={(value) => handleChange(key, value)}
                            className="w-full"
                            allowFiltering
                        />
                    </div>
                ))}

                {/* Map with glassmorphism container */}
                <div>
                    <label htmlFor="location" className="text-white font-medium mb-2 block">
                        Location on the world map
                    </label>
                    <SimpleWorldMap selectedCountry={formData.country} countries={countries} />
                </div>

                <div className="bg-white/30 h-px w-full my-2" />

                {error && (
                    <div className="error text-red-300 text-center bg-red-500/20 border border-red-400/30 rounded-md p-3">
                        {error}
                    </div>
                )}

                <footer className="w-full">
                    <CustomButton 
                        type="submit"
                        className="!h-12 !w-full flex items-center justify-center gap-3 bg-blue-600/70 hover:bg-blue-600/90 text-white rounded-lg transition-all shadow-md hover:shadow-blue-500/40"
                        disabled={loading}
                    >
                        <img 
                            src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} 
                            className={cn("size-5", {'animate-spin': loading})} 
                            alt={loading ? 'Loading' : 'Magic star'}
                        />
                        <span className="p-16-semibold text-white">
                            {loading ? 'Generating...' : 'Generate Trip'}
                        </span>
                    </CustomButton>
                </footer>
            </form>
        </section>
        </main>
    );
};

export default CreateTrip;