import { Header } from "../../../components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey, parseMarkdownToJson } from "~/lib/utlis";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account, appwriteConfig, database } from "~/appwrite/client";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ID } from "appwrite";
import { json, redirect } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const response = await fetch('https://www.apicountries.com/countries');
    const countries = await response.json();

    return json(countries.map((country: any) => ({
        name: country.name,
        coordinates: country.latlng,
        value: country.name,
        openStreetMap: country.maps?.openStreetMap,
    })));
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const user = await account.get();

    const country = formData.get('country') as string;
    const numberOfDays = Number(formData.get('duration'));
    const travelStyle = formData.get('travelStyle') as string;
    const interests = formData.get('interest') as string;
    const budget = formData.get('budget') as string;
    const groupType = formData.get('groupType') as string;
    const userId = user.$id;

    if (!country || !numberOfDays || !travelStyle || !interests || !budget || !groupType || !userId) {
        return json({ error: "Please fill out all fields." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

    try {
        const prompt = `Generate a ${numberOfDays}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interests}'
        TravelStyle: '${travelStyle}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${numberOfDays},
        "budget": "${budget}",
        "travelStyle": "${travelStyle}",
        "country": "${country}",
        "interests": ["${interests}"],
        "groupType": "${groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [0, 0],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        }
        ]
    }`;

        const textResult = await genAI
            .getGenerativeModel({ model: 'gemini-2.0-flash' })
            .generateContent([prompt]);

        const trip = parseMarkdownToJson(textResult.response.text());

        const imageResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=${country} ${interests} ${travelStyle}&client_id=${unsplashApiKey}`
        );

        const imageUrls = (await imageResponse.json()).results.slice(0, 3)
            .map((result: any) => result.urls?.regular || null);

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetails: JSON.stringify(trip),
                createdAt: new Date().toISOString(),
                imageUrls,
                userId,
            }
        );

        return redirect(`/users`);
    } catch (e) {
        console.error('Error generating travel plan: ', e);
        return json({ error: "Failed to generate trip. Please try again." }, { status: 500 });
    }
};

const CreateTrip = () => {
    const countries = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const [selectedCountry, setSelectedCountry] = useState(countries[0]?.name || '');

    const isLoading = navigation.state === 'submitting';

    const mapData = [
        {
            country: selectedCountry,
            color: '#EA382E',
            coordinates: countries.find((c: any) => c.name === selectedCountry)?.coordinates || []
        }
    ];

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title="Add a New Trip" description="View and edit AI Generated travel plans" />

            <section className="mt-2.5 wrapper-md">
                <Form className="trip-form" method="post">
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                            id="country"
                            name="country"
                            dataSource={countries.map((c: any) => ({ text: c.name, value: c.value }))}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    setSelectedCountry(e.value);
                                }
                            }}
                            allowFiltering
                            filtering={(e) => {
                                const query = e.text.toLowerCase();
                                e.updateData(
                                    countries.filter((country: any) => country.name.toLowerCase().includes(query)).map(((country: any) => ({
                                        text: country.name,
                                        value: country.value
                                    })))
                                );
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">Duration (in days)</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Enter a number of days"
                            className="form-input placeholder:text-gray-100"
                            required
                        />
                    </div>

                    {selectItems.map((key) => (
                        <div key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                name={key}
                                dataSource={comboBoxItems[key as keyof typeof comboBoxItems].map((item) => ({
                                    text: item,
                                    value: item,
                                }))}
                                fields={{ text: 'text', value: 'value' }}
                                placeholder={`Select ${formatKey(key)}`}
                                allowFiltering
                                filtering={(e) => {
                                    const query = e.text.toLowerCase();
                                    const items = comboBoxItems[key as keyof typeof comboBoxItems];
                                    e.updateData(
                                        items
                                            .filter((item) => item.toLowerCase().includes(query))
                                            .map(((item) => ({
                                                text: item,
                                                value: item,
                                            })))
                                    );
                                }}
                                className="combo-box"
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
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

                    <div className="bg-gray-200 h-px w-full" />

                    <footer className="px-6 w-full">
                        <ButtonComponent type="submit"
                            className="button-class !h-12 !w-full" disabled={isLoading}
                        >
                            <img src={`/assets/icons/${isLoading ? 'loader.svg' : 'magic-star.svg'}`} className={cn("size-5", { 'animate-spin': isLoading })} />
                            <span className="p-16-semibold text-white">
                                {isLoading ? 'Generating...' : 'Generate Trip'}
                            </span>
                        </ButtonComponent>
                    </footer>
                </Form>
            </section>
        </main>
    )
}
export default CreateTrip