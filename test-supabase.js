// Script para testear conexión con Supabase Storage
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Check environment variables
console.log('=== ENVIRONMENT CHECK ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Found' : '✗ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Found' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓ Found' : '✗ Missing');
console.log('========================');

// Print the actual values for debugging (redacted for security)
const redactKey = (key) => {
  if (!key) return 'undefined';
  if (key.length < 10) return 'Invalid key (too short)';
  return `${key.substring(0, 5)}...${key.substring(key.length - 5)}`;
};

console.log('SUPABASE_URL value:', process.env.SUPABASE_URL || 'undefined');
console.log('SUPABASE_SERVICE_ROLE_KEY (redacted):', redactKey(process.env.SUPABASE_SERVICE_ROLE_KEY));
console.log('SUPABASE_ANON_KEY (redacted):', redactKey(process.env.SUPABASE_ANON_KEY));

// Try with both keys to see which one works
async function testConnection() {
  console.log('\n🔍 TESTING CONNECTIONS...');
  
  // Test with Service Role Key
  try {
    console.log('\n🔑 TESTING WITH SERVICE ROLE KEY:');
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );
    
    console.log('📦 Fetching buckets with service role key...');
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Service role key error:', bucketsError);
    } else {
      console.log('✅ Service role connection successful!');
      console.log('Found buckets:', buckets.map(b => b.name).join(', '));
      
      // Try to access the tigreimg bucket
      if (buckets.some(b => b.name === 'tigreimg')) {
        console.log('✅ Found tigreimg bucket, testing file listing...');
        const { data: files, error: filesError } = await supabaseAdmin.storage
          .from('tigreimg')
          .list();
          
        if (filesError) {
          console.error('❌ Error listing files:', filesError);
        } else {
          console.log(`✅ Successfully accessed tigreimg bucket, found ${files.length} files/folders`);
          if (files.length > 0) {
            console.log('First 5 files/folders:', files.slice(0, 5).map(f => f.name).join(', '));
          }
        }
      } else {
        console.error('❌ tigreimg bucket NOT FOUND. You need to create it in Supabase Dashboard');
      }
    }
  } catch (error) {
    console.error('❌ Error with service role key:', error);
  }
  
  // Test with Anon Key
  try {
    console.log('\n🔑 TESTING WITH ANON KEY:');
    const supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );
    
    console.log('📦 Fetching buckets with anon key...');
    const { data: buckets, error: bucketsError } = await supabaseClient.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Anon key error:', bucketsError);
    } else {
      console.log('✅ Anon key connection successful!');
      console.log('Found buckets:', buckets.map(b => b.name).join(', '));
    }
  } catch (error) {
    console.error('❌ Error with anon key:', error);
  }
  
  console.log('\n🔧 TROUBLESHOOTING SUGGESTIONS:');
  console.log('1. Verify your SUPABASE_URL and keys in .env file');
  console.log('2. Make sure the tigreimg bucket exists in Supabase');
  console.log('3. Check if you need to create storage policies in Supabase Dashboard');
  console.log('   - Go to Storage → tigreimg → Policies');
  console.log('   - Add a policy for INSERT with: bucket_id = \'tigreimg\'');
}

testConnection();
