import {Feed} from "../feed";

it('implements optimistic currency control', async (done) => {
    // Create an instance of a feed
    const feed = Feed.build({
        title: 'fghtfh',
        imageUrl: 'agthtjfdg',
        content: 'hdgsfd',
        creator: null

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