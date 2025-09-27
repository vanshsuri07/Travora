import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from '../admin/+types/create-trip';
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utlis";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
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
    }
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }))

    const mapData = [
        {
            country: formData.country,
            color: '#2563EB',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]
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
   
    <div >
      <label htmlFor="country" className="text-white font-medium">Country</label>
       <ComboBoxComponent
                                  id="country"
                                  dataSource={countryData}
                                  fields={{ text: 'text', value: 'value' }}
                                  placeholder="Select a Country"
                                  className="combo-box w-full"
                                  change={(e: { value: string | undefined }) => {
                                      if(e.value) {
                                          handleChange('country', e.value)
                                      }
                                  }}
                                  allowFiltering
                                  filtering={(e) => {
                                      const query = e.text.toLowerCase();
      
                                      e.updateData(
                                          countries.filter((country) => country.name.toLowerCase().includes(query)).map(((country) => ({
                                              text: country.name,
                                              value: country.value
                                          })))
                                      )
                                  }}
                              />
    </div>

    {/* Duration */}
    <div>
      <label htmlFor="duration" className="text-white font-medium">Duration</label>
      <input
        id="duration"
        name="duration"
        type="number"
        placeholder="Enter a number of days"
        className="form-input placeholder:text-gray-200 w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 "
        onChange={(e) => handleChange('duration', Number(e.target.value))}
      />
    </div>

    {/* Other select items */}
    {selectItems.map((key) => (
      <div key={key}>
        <label htmlFor={key} className="text-white font-medium">{formatKey(key)}</label>
        <ComboBoxComponent
          id={key}
          dataSource={comboBoxItems[key].map((item) => ({ text: item, value: item }))}
          fields={{ text: 'text', value: 'value'}}
          placeholder={`Select ${formatKey(key)}`}
          change={(e: { value: string | undefined }) => {
            if(e.value) handleChange(key, e.value)
          }}
          allowFiltering
          filtering={(e) => {
            const query = e.text.toLowerCase();
            e.updateData(
              comboBoxItems[key]
                .filter((item) => item.toLowerCase().includes(query))
                .map((item) => ({ text: item, value: item }))
            );
          }}
          className="combo-box w-full"
        />
      </div>
    ))}

    {/* Map with glassmorphism container */}
    {/* Map with glassmorphism container */}
<div>
  <label htmlFor="location" className="text-white font-medium mb-2 block">
    Location on the world map
  </label>
  
   <div className="w-full h-64 -ml-6">
  <MapsComponent height="100%" width="100%" className="rounded-lg">
    <LayersDirective>
      <LayerDirective
        shapeData={world_map}
        dataSource={mapData}
        shapePropertyPath="name"
        shapeDataPath="country"
        shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
      />
    </LayersDirective>
  </MapsComponent>
</div>

  
</div>


    <div className="bg-white/30 h-px w-full my-2" />

    {error && (
      <div className="error text-red-300 text-center">{error}</div>
    )}

    <footer className="w-full">
      <ButtonComponent 
        type="submit"
        className="button-class !h-12 !w-full flex items-center justify-center gap-3 bg-blue-600/70 hover:bg-blue-600/90 text-white rounded-lg transition-all shadow-md hover:shadow-blue-500/40"
        disabled={loading}
      >
        <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", {'animate-spin': loading})} />
        <span className="p-16-semibold text-white">{loading ? 'Generating...' : 'Generate Trip'}</span>
      </ButtonComponent>
    </footer>
  </form>
</section>


        </main>
    );
};

export default CreateTrip;