declare const axios: any

const hamburgerIcon = document.querySelector("#hamburgerIcon")
const mobileNav = document.querySelector("#mobileNav")
const searchIcon = document.querySelector("#searchIcon")
const userInput = document.querySelector("#userInput") as HTMLInputElement
const logo = document.querySelector("#logo")
const form = document.querySelector("form")
const heroSection = document.querySelector("#heroSection") as HTMLBodyElement
const popularMovies = document.querySelector("#popularMovies") as HTMLBodyElement
const topRatedMovies = document.querySelector("#topRatedMovies") as HTMLBodyElement
const logoName = document.querySelector("#logoName")

// DIALOG 

const dialog = document.querySelector("#dialog") as HTMLDialogElement
const closeBtn = document.querySelector("#closeBtn") as HTMLButtonElement
const searchResults = document.querySelector("#searchResults") as HTMLBodyElement

interface MovieItem {
    forEach(arg0: (item: MovieItem) => void): unknown
    name?: string;
    rating?: {
        average?: number;
    };
    image?: {
        medium?: string;
        original?: string;
    };
}

interface topRated {
    rating: {
        average: number;
    }
}

hamburgerIcon?.addEventListener("click", () => {
    mobileNav?.classList.toggle("max-h-96")
    mobileNav?.classList.toggle("m-5")
    hamburgerIcon.classList.toggle("rotate-90")
})

searchIcon?.addEventListener("click", () => {
    userInput?.classList.toggle("max-lg:hidden")
    logoName?.classList.toggle("hidden")
})

const showApi = async (searchItem: string) => {
    try {
        const config = { params: { q: searchItem } }
        const req = await axios.get(`https://api.tvmaze.com/search/shows`, config)
        return req.data
    } catch (e) {
        console.log("ERROR!", e)
    }
}

const getPopularMovies = async () => {
    try {
        const req = await axios.get("https://api.tvmaze.com/shows")
        return req.data
            .filter((item: MovieItem) => item?.rating?.average)
            .sort((a: MovieItem, b: MovieItem) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
            .slice(0, 8)
    } catch (e) {
        console.log("ERROR!", e)
        return []
    }
}

const getTopRatedMovies = async () => {
    try {
        const req = await axios.get("https://api.tvmaze.com/shows")
        return req.data
            .filter((item: topRated) => item?.rating?.average > 8.5)

    } catch (e) {
        console.log("ERROR!", e)
        return []
    }
}


const renderHero = async () => {
    heroSection.innerHTML = ""
    const res = await showApi("the chosen")
    heroSection.innerHTML = `
    <div class="grid md:grid-cols-2 container mx-auto my-10">
            <div class="flex flex-col gap-y-5 my-auto">
                
                <div class="flex">
                    <h4 class="text-sm border p-1">NOW PLAYING</h4>
                </div>
                <h1 id="movieTitle" class="text-6xl font-semibold">${res[0].show.name}</h1>

                <div class="flex items-center gap-x-2">

                    <div class="flex items-center gap-x-2 border py-0.5 px-1 text-sm">
                        <i class="fa-solid fa-star"></i>
                        <h4>${res[0].show.rating.average}</h4>
                    </div>

                    <div class="flex items-center gap-x-2 border py-0.5 px-1 text-sm">
                        <h4>${res[0].show.premiered}</h4>
                    </div>
                </div>

                <h4 class="leading-7">${res[0].show.summary}</h4>

                <div class="flex gap-x-2">
                    <a href="${res[0].show.url}" class="border py-3 px-7">Watch Trailer</a>
                    <a href="${res[0].show.url}" class="border py-3 px-7">View Details</a>
                </div>
            </div>

            <div id="heroImage" class="flex justify-center items-center">
                <img src="${res[0].show.image.original}" alt="The Chosen" class="mt-10 max-h-[35rem] object-cover lg:max-h-[35rem] w-auto rounded-lg shadow-lg">
            </div>
        </div>`
}


const renderTopRatedMovies = async () => {
    const res = await getTopRatedMovies()
    topRatedMovies.innerHTML = ""

    res.forEach((item: MovieItem) => {
        topRatedMovies.innerHTML += `
        <div class="relative my-5 w-[9rem] md:w-46">
            <div>
                <div class="absolute top-2 left-2 flex items-center gap-x-2 border bg-white/80 py-0.5 px-1 text-sm rounded z-10 text-black">
                    <i class="fa-solid fa-star"></i>
                    <h4>${item.rating?.average ?? "N/A"}</h4>
                </div>
                <img src="${item.image?.medium || item.image?.original || ""}" alt="${item.name || ""}" class="block= rounded-lg w-full h-64 object-cover">
                <div class="mt-2">
                    <h4>${item.name || "Untitled"}</h4>
                </div>
            </div>
        </div>`
    })
}

const renderPopularMovie = async () => {
    const res = await getPopularMovies()
    popularMovies.innerHTML = ""

    res.forEach((item: MovieItem) => {
        popularMovies.innerHTML += `
        <div class="relative my-5 w-[9rem] md:w-46">
            <div>
                <div class="absolute top-2 left-2 flex items-center gap-x-2 border bg-white/80 py-0.5 px-1 text-sm rounded z-10 text-black">
                    <i class="fa-solid fa-star"></i>
                    <h4>${item.rating?.average ?? "N/A"}</h4>
                </div>
                <img src="${item.image?.medium || item.image?.original || ""}" alt="${item.name || ""}" class="block rounded-lg w-full h-64 object-cover">
                <div class="mt-2">
                    <h4>${item.name || "Untitled"}</h4>
                </div>
            </div>
        </div>`
    })
}

const renderSearchMovie = async (res: MovieItem) => {
    searchResults.innerHTML = ""
    res.forEach((item: MovieItem) => {
        searchResults.innerHTML += `
        <div class="relative my-5 w-46">
            <div>
                <div class="absolute top-2 left-2 flex items-center gap-x-2 border bg-white/80 py-0.5 px-1 text-sm rounded z-10 text-black">
                    <i class="fa-solid fa-star"></i>
                    <h4>${item.show?.rating?.average ?? "N/A"}</h4>
                </div>
                <img src="${item.show?.image?.medium}" alt="${item.show?.name || ""}" class="block rounded-lg w-auto h-auto object-cover">
                <div class="mt-2">
                    <h4>${item.show?.name || "Untitled"}</h4>
                </div>
            </div>
        </div>`
    })
}

renderPopularMovie()
renderHero()
renderTopRatedMovies()

form?.addEventListener("submit", async (e) => {
    e.preventDefault()

    const res = await showApi(userInput?.value)
    dialog?.showModal()
    renderSearchMovie(res)
    userInput.value = ""
})

closeBtn?.addEventListener("click", () => {
    dialog?.close()
})

export { }