import {Feed} from "../feed";

it('implements optimistic currency control', async (done) => {
    // Create an instance of a feed
    const feed = Feed.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    // Save the feed to the database
    await feed.save();

    // fetch the feed twice
    const firstInstance = await Feed.findById(feed.id);
    const secondInstance = await Feed.findById(feed.id);

    // make two separate changes to the feeds we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched feed
    await firstInstance!.save();

    // save the second fetched feed and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const feed = Feed.build({
        title: 'concert',
        price: 20,
        userId: '123',
    });

    await feed.save();
    expect(feed.version).toEqual(0);
    await feed.save();
    expect(feed.version).toEqual(1);
    await feed.save();
    expect(feed.version).toEqual(2);

});