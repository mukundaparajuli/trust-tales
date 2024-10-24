
import TempFour from "@/components/templates/TempFour"
import TempOne from "@/components/templates/TempOne"
import TempThree from "@/components/templates/TempThree"
import TempTwo from "@/components/templates/TempTwo"


export default function Page() {

    const prop = {
        name: 'Mukunda',
        project: "Mern Blog",
        message: "It was great working with you Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus tempore ea quibusdam quo nisi totam recusandae, beatae quaerat, ratione saepe expedita? Culpa ullam beatae perferendis autem? Autem quasi facere exercitationem.",
        image: "https://media.licdn.com/dms/image/v2/D5603AQGUk4XJ1YijyQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718227660402?e=1733961600&v=beta&t=0eJfMylR3Q09MSNRDgr-CNDcicfz_oQUXF8mQogUVTI",
        rating: 5
    }
    return (
        <div className="flex m-0 p-0">
            <TempOne {...prop} />
            <TempTwo {...prop} />
            <TempThree {...prop} />
            <TempFour {...prop} />

        </div>
    )
}