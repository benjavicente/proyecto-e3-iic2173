const getTagsFrequency = async (markers) => {
  let totalTags = 0;
  let tagsFrequency = {};

  markers.map(marker => {
    marker.tags.map(tag => {
      totalTags += 1;
      tagsFrequency[tag.id] ? tagsFrequency[tag.id]++ : tagsFrequency[tag.id] = 1;
    });
  });

  return {
    totalTags: totalTags,
    tagsFrequency: tagsFrequency,
  };
};


const getTagsDiff = async (senderTagsFrequency, recipientTagsFrequency) => {
  const senderTags = Object.keys(senderTagsFrequency);
  const recipientTags = Object.keys(recipientTagsFrequency);
  const keys = [...new Set(senderTags.concat(recipientTags))];

  let diff = 0;

  keys.map(key => {
    if (key in senderTagsFrequency && key in recipientTagsFrequency){
      diff += Math.abs(senderTagsFrequency[key] - recipientTagsFrequency[key]);
    } else {
      diff += senderTagsFrequency[key] ? senderTagsFrequency[key] : recipientTagsFrequency[key];
    }
  });

  return diff;
};


const calculateSiinIndex = async (senderMarkers, recipientMarkers) => {
  const senderTags = await getTagsFrequency(senderMarkers);
  const recipientTags = await getTagsFrequency(recipientMarkers);

  const diff = await getTagsDiff(senderTags.tagsFrequency, recipientTags.tagsFrequency);
  const sum = senderTags.totalTags + recipientTags.totalTags;
  const siin = (sum - diff) / sum;

  return siin;
};

module.exports = { calculateSiinIndex };