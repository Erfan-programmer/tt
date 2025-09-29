import Image from "next/image";

interface Country {
  image: string;
  name: string;
  progress: number;
  amount: string;
}

interface CountriesProps {
  countries: Country[];
  isLoading: boolean;
  error: any;
}

function TeamAccountAnalyticsCountriesSkeleton() {
  return (
    <div className="team-account-analytic-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 animate-pulse">
      <div className="h-6 w-80 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="mt-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-[#f9f9fe] dark:bg-[#0F163A] rounded-lg px-4 sm:px-[2rem] py-3 border-standard mt-4"
          >
            <div className="flex justify-between items-center text-[var(--main-background)] dark:text-white">
              <div className="flex items-center gap-3">
                <div className="w-[5rem] h-[5rem] rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex justify-between items-center gap-4 mt-3">
              <div className="w-full rounded-xl bg-white overflow-hidden h-[.8rem] p-[1px] relative">
                <div
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl p-[2px] h-full min-w-fit"
                  style={{ width: `60%` }}
                />
              </div>
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamAccountAnalyticsCountries({
  countries,
  isLoading,
  error,
}: CountriesProps) {
  if (isLoading) return <TeamAccountAnalyticsCountriesSkeleton />;
  if (error) return <div>Error loading data</div>;
  return (
    <div className="team-account-analytic-content px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5">
      <p className="text-[var(--main-background)] dark:text-white">
        Countries of the members in your organization
      </p>
      <div className="mt-4">
        {countries.map((country, idx) => (
          <div
            key={country.name + idx}
            className="bg-[#f9f9fe] dark:bg-[#0F163A] rounded-lg px-4 sm:px-[2rem] py-3 border-standard mt-4"
          >
            <div className="flex justify-between items-center text-[var(--main-background)] dark:text-white">
              <div className="flex items-center gap-3">
                <Image
                  width={400}
                  height={400}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${country.image}`}
                  className="w-[5rem] h-[5rem] rounded-full"
                  alt={country.name}
                />
                <p>{country.name}</p>
              </div>
              <p>{country.amount}</p>
            </div>
            <div className="flex justify-between items-center gap-4 mt-3">
              <div className="w-full rounded-xl bg-white overflow-hidden h-[.8rem] p-[1px] relative">
                <div
                  className={`bg-[#1a68ff] rounded-xl p-[2px] h-full flex items-center justify-center min-w-fit`}
                  style={{ width: `${country.progress}%` }}
                ></div>
              </div>
              <p className="text-[var(--main-background)] dark:text-[#D9D9D9]">
                {country.progress}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
