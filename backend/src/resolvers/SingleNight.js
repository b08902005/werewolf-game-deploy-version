const SingleNight = {
    murder: async ({ murderId }, args, { User }) => {
        let murder = await User.findOne({"_id": murderId});
        console.log(murderId);
        return murder;
    },

    poison: async ({ poisonId }, args, { User }) => {
        let poison = await User.findOne({"_id": poisonId});
        return poison;
    }
};

export default SingleNight;