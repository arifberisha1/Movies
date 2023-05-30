using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.SeedData;

public class ActorsSeedData
{
    public static async Task InitializeActors(IServiceProvider serviceProvider)
    {
        using (var scope = serviceProvider.GetRequiredService<IServiceProvider>().CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var hasActors = await context.Actors.ToListAsync();

            if (hasActors.Count == 0)
            {
                var actorsList = new List<Actor>
                {
                    new Actor
                    {
                        Name = "Kit Harington",
                        DateOfBirth = new DateTime(1986, 12, 26),
                        Biography =
                            "Christopher Catesby Harington is an English actor. He is known for his role as Jon Snow in the HBO epic fantasy television series Game of Thrones. He has received several awards, including a Golden Globe Award nomination and two Emmy Award nominations. [More](https://en.wikipedia.org/wiki/Kit_Harington)",
                        Picture = "http://localhost:5156/actors/9d552372-3f79-4ed7-81da-4c93abb0f03e.jpeg"
                    },
                    new Actor
                    {
                        Name = "Emilia Clarke",
                        DateOfBirth = new DateTime(1986, 10, 23),
                        Biography =
                            "Emilia Isobel Euphemia Rose Clarke is a British actress. She is best known for her portrayal of Daenerys Targaryen in Game of Thrones. She has received various accolades, including an Empire Award, a Saturn Award, three Critics' Choice Award nominations and four Primetime Emmy Award nominations. [More](https://en.wikipedia.org/wiki/Emilia_Clarke)",
                        Picture = "http://localhost:5156/actors/9bec4ac3-fa06-4093-a363-0cdbb06c38d8.jpeg"
                    },
                    new Actor
                    {
                        Name = "Keanu Reeves",
                        DateOfBirth = new DateTime(1964, 9, 2),
                        Biography =
                            "Keanu Charles Reeves is a Canadian actor. Born in Beirut and raised in Toronto, Reeves began acting in theatre productions and in television films before making his feature film debut in Youngblood. [More](https://en.wikipedia.org/wiki/Keanu_Reeves)",
                        Picture = "http://localhost:5156/actors/e3a35dc4-0675-40bb-8a1c-0f5814e76b35.jpeg"
                    },
                    new Actor
                    {
                        Name = "Dwayne Johnson",
                        DateOfBirth = new DateTime(1972, 5, 2),
                        Biography =
                            "Dwayne Douglas Johnson is an American actor, film producer, and former professional wrestler known by the ring name The Rock. [More](https://en.wikipedia.org/wiki/Dwayne_Johnson)",
                        Picture = "http://localhost:5156/actors/f2c79ce2-3cea-462b-ba42-d9d574a3a40a.jpeg"
                    },
                    new Actor
                    {
                        Name = "Jason Momoa",
                        DateOfBirth = new DateTime(1979, 8, 1),
                        Biography =
                            "Joseph Jason Namakaeha Momoa is an American actor. He made his acting debut as Jason Ioane on the syndicated action drama series Baywatch: Hawaii, which was followed by portrayals of Ronon Dex on the ... [More](https://en.wikipedia.org/wiki/Jason_Momoa)",
                        Picture = "http://localhost:5156/actors/2931bc25-2cc3-4bb4-9e17-32b9aa4ffa34.jpg"
                    },
                    new Actor
                    {
                        Name = "Amber Heard",
                        DateOfBirth = new DateTime(1986, 4, 22),
                        Biography =
                            "Amber Laura Heard is an American actress, humanitarian, and social activist. She had her first leading role in the horror film All the Boys Love Mandy Lane, and went on to star in films such as The Ward, Drive Angry, and London Fields. [More](https://en.wikipedia.org/wiki/Amber_Heard)",
                        Picture = "http://localhost:5156/actors/7f5eec99-9fa1-48c9-8ec5-1faf7118fc13.jpeg"
                    },
                    new Actor
                    {
                        Name = "Johnny Depp",
                        DateOfBirth = new DateTime(1963, 6, 9),
                        Biography =
                            "John Christopher Depp II is an American actor. He is the recipient of multiple accolades, including a Golden Globe Award and a Screen Actors Guild Award, and has been nominated for three Academy Awards and two BAFTA awards. [More](https://en.wikipedia.org/wiki/Johnny_Depp)",
                        Picture = "http://localhost:5156/actors/f2064715-69a7-4408-a56c-c047dbf20de2.jpg"
                    },
                    new Actor
                    {
                        Name = "Chris Evans",
                        DateOfBirth = new DateTime(1981, 6, 13),
                        Biography =
                            "Christopher Robert Evans is an American actor. He began his career with roles in television series such as Opposite Sex in 2000. [More](https://en.wikipedia.org/wiki/Chris_Evans_(actor))",
                        Picture = "http://localhost:5156/actors/39836f1c-cb8f-4e85-98de-d3532b95e27e.jpg"
                    },
                    new Actor
                    {
                        Name = "Ana de Armas",
                        DateOfBirth = new DateTime(1988, 4, 30),
                        Biography =
                            "Ana Celia de Armas Caso is a Cuban and Spanish actress. She began her career in Cuba with a leading role in the romantic drama Una rosa de Francia. At the age of 18, she moved to Madrid, Spain, and starred in the popular drama El Internado for six seasons from 2007 to 2010. [More](https://en.wikipedia.org/wiki/Ana_de_Armas)",
                        Picture = "http://localhost:5156/actors/857fad6c-059c-4595-a9a4-153971e87344.jpeg"
                    },
                    new Actor
                    {
                        Name = "Vin Diesel",
                        DateOfBirth = new DateTime(1967, 7, 18),
                        Biography =
                            "Mark Sinclair, known professionally as Vin Diesel, is an American actor and film producer. One of the world's highest-grossing actors, he is best known for playing Dominic Toretto in the Fast & Furious franchise. [More](https://en.wikipedia.org/wiki/Vin_Diesel)",
                        Picture = "http://localhost:5156/actors/0cc82280-f0f8-4532-9cc8-e6ec3bb13738.jpeg"
                    },
                    new Actor
                    {
                        Name = "Sam Worthington",
                        DateOfBirth = new DateTime(1976, 8, 2),
                        Biography =
                            "Samuel Henry John Worthington is an Australian actor. He was born in England and moved to Australia when he was 6 months old and was raised there. [More](https://en.wikipedia.org/wiki/Sam_Worthington)",
                        Picture = "http://localhost:5156/actors/b05d4d73-1601-4ced-8f12-678699cd9136.jpeg"
                    },
                    new Actor
                    {
                        Name = "Zoe Saldana",
                        DateOfBirth = new DateTime(1978, 6, 19),
                        Biography =
                            "Zoë Yadira Saldaña-Perego is an American actress. Known primarily for her work in science fiction film franchises, she has appeared in all three of the highest-grossing films of all time, a feat not achieved by any other performer. [More](https://en.wikipedia.org/wiki/Zoe_Salda%C3%B1a)",
                        Picture = "http://localhost:5156/actors/24b99b27-0bb2-4660-98c5-fc7782c0c846.jpeg"
                    },
                    new Actor
                    {
                        Name = "Jennifer Lawrence",
                        DateOfBirth = new DateTime(1990, 8, 15),
                        Biography =
                            "Jennifer Shrader Lawrence is an American actress. The world's highest-paid actress in 2015 and 2016, her films have grossed over $6 billion worldwide. She appeared in Time's 100 most influential people in the world list in 2013 and the Forbes Celebrity 100 list from 2013 to 2016. [More](https://en.wikipedia.org/wiki/Jennifer_Lawrence)",
                        Picture = "http://localhost:5156/actors/5d108b32-5bff-4e4b-ba61-8976b64258f9.jpg"
                    },
                    new Actor
                    {
                        Name = "Mia Wasikowska",
                        DateOfBirth = new DateTime(1989, 10, 25),
                        Biography =
                            "Mia Wasikowska is an Australian actress. She made her screen debut on the Australian television drama All Saints in 2004, followed by her feature film debut in Suburban Mayhem. She first became known to a wider audience following her critically acclaimed work on the HBO television series In Treatment. [More](https://en.wikipedia.org/wiki/Mia_Wasikowska)",
                        Picture = "http://localhost:5156/actors/b8e483cc-5410-45cd-940d-cb20acba23cd.jpeg"
                    }
                };

                foreach (var actor in actorsList)
                {
                    var exist = await context.Actors.FirstOrDefaultAsync(x => x.Name == actor.Name);

                    if (exist == null)
                    {
                        context.Actors.Add(actor);
                    }
                }

                await context.SaveChangesAsync();
            }
        }
    }
}